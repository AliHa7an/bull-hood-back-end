import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose_delete from 'mongoose-delete';

export type UserDocument = User & Document & mongoose_delete.SoftDeleteDocument;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, lowercase: true, unique: true, required: true })
  email: string;

  @Prop({ type: String, select: false, required: true })
  password: string;

  @Prop()
  mobile: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  gender: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  username: string;

  @Prop({
    type: String,
  })
  profilePicture?: string;

  @Prop()
  salt?: string;

  validatePassword: (comparePass: string, passHash: string) => Promise<boolean>;
}

export const userSchema = SchemaFactory.createForClass(User);
userSchema.plugin(mongoose_delete, { overrideMethods: true });

userSchema.methods.validatePassword = (
  comparePass: string,
  passHash: string,
): Promise<boolean> => {
  return bcrypt.compare(comparePass, passHash);
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
userSchema.pre('save', async function preSave(next) {
  const user: User = this as UserDocument;
  if (!user.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    user.salt = salt;
    return next();
  } catch (e) {
    return next(e);
  }
});
