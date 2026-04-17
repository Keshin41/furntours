import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventPartType, EventType } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { EVENT_INCLUDE } from './constant';
import { CreateMeetDto, UpdateMeetDto } from './event.dto';
import { mapEventToFurmeet, sortByEventDateDesc } from './event.utils';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private toEventActivityData(
    eventActivities: CreateMeetDto['eventActivities'],
  ) {
    return eventActivities.map((activity, index) => {
      const parsedDate = new Date(activity.date);

      if (Number.isNaN(parsedDate.getTime())) {
        throw new BadRequestException(
          `Invalid activity date at index ${index}`,
        );
      }

      return {
        title: activity.title,
        description: activity.description || '',
        date: parsedDate,
        order: activity.order ?? index,
        type: activity.type ?? EventPartType.OTHER,
      };
    });
  }

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
      .map((event) => mapEventToFurmeet(event))
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

    return mapEventToFurmeet(event);
  }

  async updateById(id: string, dto: UpdateMeetDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id },
      select: { id: true, type: true },
    });

    if (!existingEvent || existingEvent.type !== EventType.MEET) {
      throw new NotFoundException('Meet not found');
    }

    const eventActivities = this.toEventActivityData(dto.eventActivities);

    await this.prisma.$transaction(async (tx) => {
      await tx.eventPart.deleteMany({
        where: { eventId: id },
      });

      await tx.event.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description || '',
          imageUrl: dto.imageUrl?.trim() || null,
          published: dto.published,
          opened: dto.opened,
        },
      });

      if (eventActivities.length > 0) {
        await tx.eventPart.createMany({
          data: eventActivities.map((a) => ({ ...a, eventId: id })),
        });
      }
    });

    const event = await this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: EVENT_INCLUDE,
    });

    return mapEventToFurmeet(event);
  }

  async updateImage(id: string, imageUrl?: string) {
    const event = await this.prisma.event.update({
      where: { id },
      data: {
        imageUrl: imageUrl?.trim() || null,
      },
      include: EVENT_INCLUDE,
    });

    if (event.type !== EventType.MEET) {
      return null;
    }

    return mapEventToFurmeet(event);
  }
}
