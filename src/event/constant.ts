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

export const EVENT_FORM_INCLUDE = {
  eventActivities: {
    select: {
      id: true,
      order: true,
      title: true,
      eventPartFieldDefinitions: {
        select: {
          id: true,
          type: true,
          order: true,
          label: true,
          required: true,
        },
        orderBy: {
          order: 'asc' as const,
        },
      },
    },
    orderBy: {
      order: 'asc' as const,
    },
  },
};
