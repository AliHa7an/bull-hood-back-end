import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose_delete from 'mongoose-delete';
import { User } from './user.schema';

export type BrokerDocument = Broker &
  Document &
  mongoose_delete.SoftDeleteDocument;

@Schema({ timestamps: true })
export class Broker {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  token: string;

  @Prop({ type: String, required: true, unique: true })
  apiKey: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ required: true })
  brokers: string;

  @Prop()
  exchanges: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  salt?: string;

  validatePassword: (comparePass: string, passHash: string) => Promise<boolean>;
}

export const brokerSchema = SchemaFactory.createForClass(Broker);
brokerSchema.plugin(mongoose_delete, { overrideMethods: true });

brokerSchema.methods.validatePassword = (
  comparePass: string,
  passHash: string,
): Promise<boolean> => {
  return bcrypt.compare(comparePass, passHash);
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
brokerSchema.pre('save', async function preSave(next) {
  const broker: Broker = this as BrokerDocument;
  if (!broker.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt();
    broker.password = await bcrypt.hash(broker.password, salt);
    broker.salt = salt;
    return next();
  } catch (e) {
    return next(e);
  }
});
