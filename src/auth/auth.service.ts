import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { Token } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserPassword(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    if (!(await user.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Incorrect password');
    }

    return await this.usersService.getUserById(user?.id);
  }

  async login(user: User): Promise<string> {
    const payload: Token = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };

    return await this.jwtService.signAsync(payload);
  }
}
