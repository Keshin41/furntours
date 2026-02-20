import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthResponse } from './AuthResponse';
import { JwtPayload } from './auth.guard';
import { compare, hash } from 'bcrypt';

const HASH_ROUNDS: number = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(data.email);

    const hashedPassword: string = await hash(data.password, HASH_ROUNDS);

    const isPasswordValid: boolean = await compare(
      user ? user.password : '',
      hashedPassword,
    );
    if (!user || !isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken: accessToken };
  }
}
