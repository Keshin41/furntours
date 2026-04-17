import { createZodDto } from 'nestjs-zod';
import { EventPartType } from 'src/generated/prisma/enums';
import { z } from 'zod';

const EventActivitySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(''),
  date: z.string().trim().min(1),
  order: z.number().int().nonnegative().optional(),
  type: z.enum(EventPartType).optional().default(EventPartType.OTHER),
});

const UpsertMeetSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(''),
  imageUrl: z.string().trim().optional().default(''),
  published: z.boolean().default(false),
  opened: z.boolean().default(false),
  eventActivities: z.array(EventActivitySchema).default([]),
});

export class CreateMeetDto extends createZodDto(UpsertMeetSchema) {}
export class UpdateMeetDto extends createZodDto(UpsertMeetSchema) {}
