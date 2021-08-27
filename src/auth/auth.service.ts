import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { Token } from './strategies/jwt.strategy';

export interface TokenResponse {
  access_token: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserPassword(username);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    if (!(await user.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Incorrect password');
    }
    return user;
  }

  async login(user: User): Promise<TokenResponse> {
    const payload: Token = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
