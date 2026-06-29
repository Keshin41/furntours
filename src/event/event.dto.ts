import { createZodDto } from 'nestjs-zod';
import { EventPartType, FieldType } from 'src/generated/prisma/enums';
import { z } from 'zod';

const EventActivityQuestionSchema = z.object({
  label: z.string().trim().min(1),
  order: z.number().int().nonnegative().optional(),
  type: z.enum(FieldType).optional().default(FieldType.TEXT),
  required: z.boolean().default(false),
});

const EventActivitySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(''),
  date: z.string().trim().min(1),
  order: z.number().int().nonnegative().optional(),
  type: z.enum(EventPartType).optional().default(EventPartType.OTHER),
  activityQuestions: z.array(EventActivityQuestionSchema).optional(),
});

const UpsertEventSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(''),
  imageUrl: z.string().trim().optional().default(''),
  published: z.boolean().default(false),
  opened: z.boolean().default(false),
  eventActivities: z.array(EventActivitySchema).default([]),
});

export class CreateEventDto extends createZodDto(UpsertEventSchema) {}
export class UpdateEventDto extends createZodDto(UpsertEventSchema) {}
