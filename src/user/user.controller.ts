import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { JwtPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';
import { User } from 'src/generated/prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() payload: JwtPayload): Promise<User> {
    return this.userService.getUserById(payload.sub);
  }
}
