import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }
}
