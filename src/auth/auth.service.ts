import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthResponse } from './AuthResponse';
import { JwtPayload } from './auth.guard';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(data.email);
    console.log('user', user);

    const isPasswordValid: boolean = await compare(
      data.password,
      user?.password ?? '',
    );
    if (!user || !isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    console.log('token', accessToken);
    return { accessToken: accessToken };
  }
}
