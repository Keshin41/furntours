import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { JwtPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';
import { UpdatePasswordDto, UpdateProfileDto } from './user.dto';
import { UserProfile } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() payload: JwtPayload): Promise<UserProfile> {
    return this.userService.getProfileById(payload.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(
    @CurrentUser() payload: JwtPayload,
    @Body() data: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.userService.updateProfile(payload.sub, data);
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  async updatePassword(
    @CurrentUser() payload: JwtPayload,
    @Body() data: UpdatePasswordDto,
  ): Promise<{ success: true }> {
    await this.userService.updatePassword(payload.sub, data);
    return { success: true };
  }
}
