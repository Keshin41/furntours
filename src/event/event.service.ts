import { Injectable, NotFoundException } from '@nestjs/common';
import { EventType } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { EVENT_INCLUDE } from './constant';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import {
  mapEventPartDtoToEventPart,
  mapEventToFurmeet as mapEventToMeetResponse,
  sortByEventDateDesc,
} from './event.utils';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const events = await this.prisma.event.findMany({
      where: {
        type: EventType.MEET,
      },
      include: EVENT_INCLUDE,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return events
      .map((event) => mapEventToMeetResponse(event))
      .sort((a, b) => sortByEventDateDesc(a, b));
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: EVENT_INCLUDE,
    });

    if (event?.type !== EventType.MEET) {
      return null;
    }

    return mapEventToMeetResponse(event);
  }

  async createMeet(createEventDto: CreateEventDto) {
    const eventActivities = mapEventPartDtoToEventPart(
      createEventDto.eventActivities,
    );

    const event = await this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description || '',
        imageUrl: createEventDto.imageUrl?.trim() || '',
        type: EventType.MEET,
        published: createEventDto.published,
        opened: createEventDto.opened,
        eventActivities: {
          create: eventActivities,
        },
      },
      include: EVENT_INCLUDE,
    });

    return mapEventToMeetResponse(event);
  }

  async updateById(eventId: string, eventUpdateDto: UpdateEventDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, type: true },
    });

    if (!existingEvent || existingEvent.type !== EventType.MEET) {
      throw new NotFoundException('Meet not found');
    }

    const eventActivities = mapEventPartDtoToEventPart(
      eventUpdateDto.eventActivities,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.eventPart.deleteMany({
        where: { eventId: eventId },
      });

      await tx.event.update({
        where: { id: eventId },
        data: {
          title: eventUpdateDto.title,
          description: eventUpdateDto.description || '',
          imageUrl: eventUpdateDto.imageUrl?.trim() || '',
          published: eventUpdateDto.published,
          opened: eventUpdateDto.opened,
        },
      });

      if (eventActivities.length > 0) {
        await tx.eventPart.createMany({
          data: eventActivities.map((a) => ({ ...a, eventId: eventId })),
        });
      }
    });

    const event = await this.prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      include: EVENT_INCLUDE,
    });

    return mapEventToMeetResponse(event);
  }

  async updateImage(id: string, imageUrl?: string) {
    const event = await this.prisma.event.update({
      where: { id },
      data: {
        imageUrl: imageUrl?.trim() || '',
      },
      include: EVENT_INCLUDE,
    });

    if (event.type !== EventType.MEET) {
      return null;
    }

    return mapEventToMeetResponse(event);
  }
}
