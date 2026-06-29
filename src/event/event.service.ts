import { Injectable, NotFoundException } from '@nestjs/common';
import { EventPartType, EventType } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { EVENT_FORM_INCLUDE, EVENT_INCLUDE } from './constant';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import {
  AnswerDto,
  mapEventFormToDto,
  mapEventPartDtoToEventPart,
  mapEventToFurmeet as mapEventToMeetResponse,
  sortByEventDateDesc,
} from './event.utils';

export type EventActicity = {
  id: string;
  title: string;
  description: string;
  type: EventPartType;
  date: Date;
  order: number;
};

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
      .map((event) => mapEventToMeetResponse(event, false))
      .sort((a, b) => sortByEventDateDesc(a, b));
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: EVENT_INCLUDE,
    });

    if (event == null) {
      return null;
    }

    const hasAttachedForm = await this.eventHasAttachedForm(
      event.eventActivities,
    );

    return mapEventToMeetResponse(event, hasAttachedForm);
  }

  async eventHasAttachedForm(
    eventActivities: EventActicity[],
  ): Promise<boolean> {
    const activityIds = eventActivities.map((activity) => {
      return activity.id;
    });
    const question = await this.prisma.eventPartFieldDefinition.findFirst({
      where: {
        eventPartId: {
          in: activityIds,
        },
      },
    });
    return question != null;
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

    return mapEventToMeetResponse(event, false);
  }

  async updateById(eventId: string, eventUpdateDto: UpdateEventDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, type: true },
    });

    if (existingEvent?.type !== EventType.MEET) {
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

    return mapEventToMeetResponse(event, false);
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

    return mapEventToMeetResponse(event, false);
  }

  async getEventForm(id: string) {
    const eventForm = await this.prisma.event.findUnique({
      where: { id },
      include: EVENT_FORM_INCLUDE,
    });

    if (eventForm == null) return null;

    return mapEventFormToDto(eventForm);
  }
  async processFormAnswer(answers: AnswerDto[]) {
    // pas de lien direct avec le user car pas de connexion possible
    // 1 question avec le pseudo demandé
    // si pseudo connu => on a le user, sinon, on le créer

    const nickname = answers[0].answer;

    let user = await this.prisma.user.findFirst({
      where: {
        nickname: nickname,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          nickname: nickname,
          email: "empty email",
          firstname: "empty firstname",
          lastname: "empty lastname",
        },
      });
    }

    // On recupere l'event part ou relier la reponse

    const questionIdToEventPartId: {questionId: string, Event} = [];

    // On cree le lien form/user


    // insert each answers into the database
    answers.forEach((answer) => {
      const registration = await this.prisma.registration.upsert({
        where: {
          eventPartId: answer.eventPartId,
          userId: user.id,
        }
      })

      await this.prisma.registrationAnswer.create({
        data: {
          registrationId: registration.id,
          value: answer.answer,
          fieldDefinitionId: answer.questionId,
        }
      })
  }
}
