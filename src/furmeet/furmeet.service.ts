import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FurmeetService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.event.findMany();
  }

  findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }
}
