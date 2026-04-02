import { Injectable } from '@nestjs/common';
import { EventType } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { EVENT_INCLUDE } from './constant';
import { mapEventToFurmeet, sortByEventDateDesc } from './event.utils';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const events = await this.prisma.event.findMany({
      where: {
        type: EventType.MEET,
      },
      include: EVENT_INCLUDE,
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

    if (!event || event.type !== EventType.MEET) {
      return null;
    }

    return mapEventToFurmeet(event);
  }
}
