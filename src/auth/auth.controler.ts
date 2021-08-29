import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/filters/all-exception.filter';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@UseFilters(new AllExceptionsFilter())
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    const token = await this.authService.login(user);
    return { user, token };
  }

  @Post('signup')
  async register(@Body() body: SignupDto) {
    if (await this.userService.getUserByUserName(body.username)) {
      throw new BadRequestException('Username already exists');
    }

    if (await this.userService.getUserByEmail(body.email)) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userService.signUp(body);

    const token = await this.authService.login(user);

    return { user, token };
  }
}
