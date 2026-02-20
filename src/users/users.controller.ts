import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { JwtPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';
import { User } from 'src/generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() payload: JwtPayload): Promise<User> {
    return this.usersService.getUserById(payload.sub);
  }
}
