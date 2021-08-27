import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from 'src/constant/constants';

export interface Token {
  sub: ObjectId | string;
  username: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate({ sub }: Token) {
    const user = await this.userService.getUserById(sub);

    if (!user) {
      throw new UnauthorizedException('Unable to find user');
    }

    return user;
  }
}
