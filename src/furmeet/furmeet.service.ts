import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FurmeetService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.furmeet.findMany();
  }

  findById(id: string) {
    return this.prisma.furmeet.findUnique({
      where: { id },
    });
  }
}
