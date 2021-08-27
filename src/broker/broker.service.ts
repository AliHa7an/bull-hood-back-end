import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Broker, BrokerDocument } from 'src/schemas/brokers.schema';

@Injectable()
export class BrokerService {
  constructor(
    @InjectModel(Broker.name)
    private brokerModel: SoftDeleteModel<BrokerDocument>,
  ) {}

  async create(body: Broker) {
    return new this.brokerModel(body).save();
  }

  async findAll() {
    return this.brokerModel.find().exec();
  }

  async findOne(id: ObjectId) {
    return this.brokerModel.findOne({ _id: id }).exec();
  }
}
