import { BadRequestException } from '@nestjs/common';
import { EventPartType, FieldType } from 'src/generated/prisma/enums';
import { CreateEventDto } from './event.dto';
import { EventWithActivities, MeetActivity, MeetResponse } from './types/event';

export const sortActivitiesByDate = (
  activities: MeetActivity[],
): MeetActivity[] => {
  return [...activities].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.date.getTime() - b.date.getTime();
  });
};

export const getEventDate = (activities: MeetActivity[]): Date | null => {
  return activities[0]?.date ?? null;
};

export const toTimestamp = (value: Date | null): number => {
  return value ? value.getTime() : 0;
};

export const mapEventToFurmeet = (
  event: EventWithActivities,
  hasAttachedForm: boolean,
): MeetResponse => {
  const sortedActivities = sortActivitiesByDate(event.eventActivities);
  const eventDate = getEventDate(sortedActivities);

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl,
    type: event.type,
    published: event.published,
    opened: event.opened,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    eventDate,
    eventActivities: sortedActivities,
    hasAttachedForm: hasAttachedForm,
  };
};

export const sortByEventDateDesc = (
  a: MeetResponse,
  b: MeetResponse,
): number => {
  return toTimestamp(b.eventDate) - toTimestamp(a.eventDate);
};

export const mapEventPartDtoToEventPart = (
  eventActivities: CreateEventDto['eventActivities'],
) => {
  return eventActivities.map((activity, index) => {
    console.log(
      '🚀 ~ mapEventPartDtoToEventPart ~ activity.activityQuestions:',
      activity.activityQuestions,
    );
    const parsedDate = new Date(activity.date);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`Invalid activity date at index ${index}`);
    }

    const fieldDefinitions = (activity.activityQuestions ?? []).map(
      (question, questionIndex) => {
        const fieldOptions = (question.choices ?? []).map(
          (option, optionIndex) => ({
            label: option.label,
            order: option.order ?? optionIndex,
          }),
        );

        return {
          label: question.label,
          order: question.order ?? questionIndex,
          type: question.type ?? FieldType.TEXT,
          required: question.required ?? false,
          ...(fieldOptions.length > 0
            ? {
                options: {
                  create: fieldOptions,
                },
              }
            : {}),
        };
      },
    );

    return {
      title: activity.title,
      description: activity.description || '',
      date: parsedDate,
      order: activity.order ?? index,
      type: activity.type ?? EventPartType.OTHER,
      ...(fieldDefinitions.length > 0
        ? {
            eventPartFieldDefinitions: {
              create: fieldDefinitions,
            },
          }
        : {}),
    };
  });
};

export type EventForm = {
  eventActivities: {
    id: string;
    order: number;
    title: string;
    eventPartFieldDefinitions: {
      id: string;
      type: FieldType;
      order: number;
      label: string;
      required: boolean;
      options: {
        id: string;
        label: string;
        order: number;
      }[];
    }[];
  }[];
};

export type OptionDto = {
  id: string;
  label: string;
  value: string;
  order: number;
};

export type QuestionDto = {
  id: string;
  question: string;
  required: boolean;
  type: FieldType;
  options: OptionDto[];
};

export type FormDto = {
  id: string;
  activity: string;
  questions: QuestionDto[];
}[];

export type AnswerDto = {
  questionId: string;
  answer: string;
};

export type FormAnswersDto = {
  email: string;
  activities: ActivityAnswersDto[];
};

export type ActivityAnswersDto = {
  activityId: string;
  present: boolean;
  answers: AnswerDto[];
};

export const mapEventFormToDto = (eventForm: EventForm) => {
  const dto: FormDto = [];

  eventForm.eventActivities.forEach((activity) => {
    const questions: QuestionDto[] = [];
    activity.eventPartFieldDefinitions.forEach((question) => {
      const options: OptionDto[] = [];
      question.options.forEach((option) => {
        options.push({
          id: option.id,
          label: option.label,
          order: option.order,
          value: option.label,
        });
      });
      questions.push({
        id: question.id,
        question: question.label,
        required: question.required,
        type: question.type,
        options: options,
      });
    });

    dto.push({
      id: activity.id,
      activity: activity.title,
      questions: questions,
    });
  });
  return dto;
};
