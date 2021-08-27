import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from '../../users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    if (request.body.inviteToken) {
      return true;
    }
    const userExist = await this.userService.getUserByEmail(request.body.email);
    if (userExist) {
      throw new ForbiddenException('This user already exist');
    }
    return true;
  }
}
