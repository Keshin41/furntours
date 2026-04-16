import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Prisma, User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePasswordDto, UpdateProfileDto } from './user.dto';

const userProfileSelect = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  email: true,
  address: true,
  postalCode: true,
  city: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;

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

  async getProfileById(id: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userProfileSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { id },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        nickname: data.nickname,
        email: data.email,
        address: data.address ?? null,
        postalCode: data.postalCode ?? null,
        city: data.city ?? null,
      },
      select: userProfileSelect,
    });
  }

  async updatePassword(id: string, data: UpdatePasswordDto): Promise<void> {
    const user = await this.getUserById(id);

    if (!user.password) {
      throw new BadRequestException('User has no password configured');
    }

    const isCurrentPasswordValid = await compare(data.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is invalid');
    }

    const hashedPassword = await hash(data.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
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
