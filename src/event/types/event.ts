import { EventPartType, EventType } from 'src/generated/prisma/client';

export type FurmeetActivity = {
  id: string;
  order: number;
  type: EventPartType;
  date: Date;
  title: string;
  description: string;
};

export type EventWithActivities = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  type: EventType;
  published: boolean;
  opened: boolean;
  createdAt: Date;
  updatedAt: Date;
  eventActivities: FurmeetActivity[];
};

export type FurmeetResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  type: EventType;
  published: boolean;
  opened: boolean;
  createdAt: Date;
  updatedAt: Date;
  eventDate: Date | null;
  eventActivities: FurmeetActivity[];
};
