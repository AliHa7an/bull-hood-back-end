import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  UseFilters,
  NotFoundException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';
import { ObjectId } from 'mongoose';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/currentUser.decorator';
import { AllExceptionsFilter } from '../filters/all-exception.filter';

@UseFilters(new AllExceptionsFilter())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() userData: User) {
    const user = await this.userService.getUserByEmail(userData.email);
    if (user) return user;
    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    const users = await this.userService.findAll();
    if (users.length !== 0) {
      return users;
    }
    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: ObjectId) {
    const user = await this.userService.getUserById(id);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: ObjectId) {
    const result = await this.userService.softDelete(id);
    if (result) {
      return 'Successfully Deleted';
    }
    throw new BadRequestException('Failed to Delete');
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(@Body() body: User) {
    const createdUser = await this.userService.create(body);
    if (createdUser) {
      return createdUser;
    }
    throw new BadRequestException('Failed to Create');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOne(
    @Param('id') id: ObjectId,
    @Body() body: User,
    @Res() res: Response,
  ) {
    const update = await this.userService.update(id, body);
    if (update.nModified === 1) {
      res.status(HttpStatus.OK).send('Successfully Updated');
    }
    throw new BadRequestException('Failed to Update');
  }

  @Get('restore/:id')
  async restore(@Param('id') id: ObjectId) {
    if (await this.userService.findOne(id)) {
      throw new BadRequestException('User already Available');
    }
    await this.userService.restoreDeleted(id);
    return 'Successfully Restored';
  }
}
