export const EVENT_INCLUDE = {
  eventActivities: {
    select: {
      id: true,
      order: true,
      type: true,
      date: true,
      title: true,
      description: true,
    },
    orderBy: {
      order: 'asc' as const,
    },
  },
};
