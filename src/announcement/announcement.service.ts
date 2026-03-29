import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export type Announcement = {
  id: string;
  title: string;
  message: string;
  active: boolean;
  actionLabel?: string;
  actionUrl?: string;
};

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent(): Promise<Announcement | null> {
    const announcement = await this.prisma.announcement.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!announcement) return null;

    return {
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      active: announcement.active,
      actionLabel: announcement.actionLabel ?? undefined,
      actionUrl: announcement.actionUrl ?? undefined,
    };
  }
}
