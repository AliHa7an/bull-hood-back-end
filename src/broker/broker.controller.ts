import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from 'src/filters/all-exception.filter';
import { Broker } from 'src/schemas/brokers.schema';
import { BrokerService } from './broker.service';

@UseFilters(new AllExceptionsFilter())
@Controller('brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    const users = await this.brokerService.findAll();
    if (users.length !== 0) {
      return users;
    }
    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(@Body() body: Broker) {
    const createdUser = await this.brokerService.create(body);
    if (createdUser) {
      return createdUser;
    }
    throw new BadRequestException('Failed to create');
  }
}
