import {
  EventWithActivities,
  FurmeetActivity,
  FurmeetResponse,
} from './types/event';

export const sortActivitiesByDate = (
  activities: FurmeetActivity[],
): FurmeetActivity[] => {
  return [...activities].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.date.getTime() - b.date.getTime();
  });
};

export const getEventDate = (activities: FurmeetActivity[]): Date | null => {
  return activities[0]?.date ?? null;
};

export const toTimestamp = (value: Date | null): number => {
  return value ? value.getTime() : 0;
};

export const mapEventToFurmeet = (
  event: EventWithActivities,
): FurmeetResponse => {
  const sortedActivities = sortActivitiesByDate(event.eventActivities);
  const eventDate = getEventDate(sortedActivities);

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.type,
    published: event.published,
    opened: event.opened,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    eventDate,
    eventActivities: sortedActivities,
  };
};

export const sortByEventDateDesc = (
  a: FurmeetResponse,
  b: FurmeetResponse,
): number => {
  return toTimestamp(b.eventDate) - toTimestamp(a.eventDate);
};
