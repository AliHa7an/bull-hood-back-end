import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Broker, brokerSchema } from 'src/schemas/brokers.schema';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Broker.name,
        schema: brokerSchema,
      },
    ]),
  ],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
