import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventPartType, EventType } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { EVENT_FORM_INCLUDE, EVENT_INCLUDE } from './constant';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import {
  FormAnswersDto,
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
    console.log(
      '🚀 ~ EventService ~ createMeet ~ createEventDto:',
      createEventDto,
    );
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
    console.log(
      '🚀 ~ EventService ~ updateById ~ eventUpdateDto:',
      eventUpdateDto,
    );
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

  async processFormAnswer(formAnswers: FormAnswersDto) {
    const user = await this.prisma.user.upsert({
      where: {
        email: formAnswers.email,
      },
      create: {
        email: formAnswers.email,
        firstname: 'firstname',
        lastname: 'lastname',
        nickname: 'nickname',
      },
      update: {},
    });

    const count = await this.prisma.registration.count({
      where: {
        userId: user.id,
        eventPartId: {
          in: formAnswers.activities.map((activity) => activity.activityId),
        },
      },
    });

    const isAlreadyAnswered = count > 0;

    if (isAlreadyAnswered)
      throw new HttpException('Erreur', HttpStatus.BAD_REQUEST);

    for (const activityAnswersDto of formAnswers.activities) {
      if (activityAnswersDto.present) {
        const registration = await this.prisma.registration.create({
          data: {
            eventPartId: activityAnswersDto.activityId,
            userId: user.id,
          },
        });
        for (const answerDto of activityAnswersDto.answers) {
          await this.prisma.registrationAnswer.create({
            data: {
              registrationId: registration.id,
              fieldDefinitionId: answerDto.questionId,
              value: answerDto.answer,
            },
          });
        }
      }
    }
  }

  async getRegistrations() {
    const registrations = await this.prisma.registration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        eventPart: {
          select: {
            id: true,
            title: true,
            event: {
              select: {
                title: true,
              },
            },
          },
        },
        answers: {
          select: {
            value: true,
            fieldDefinition: {
              select: {
                label: true,
              },
            },
          },
        },
      },
    });
    const truc = registrations.map((registration) => ({
      event: registration.eventPart.event.title,
      nickname: registration.user.nickname,
      eventPart: {
        id: registration.eventPart.id,
        label: registration.eventPart.title,
      },
      choices: registration.answers.map((answer) => ({
        id: answer.fieldDefinition.label,
        value: answer.value,
      })),
    }));
    return truc;
  }
}
