import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { SignupDto } from 'src/auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
  ) {}

  async getUserByUserName(username: string) {
    return this.UserModel.findOne({ username }).exec();
  }

  async getUserByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }

  async getUserById(id: ObjectId | string) {
    return this.UserModel.findById(id).exec();
  }

  async getUserPassword(username: string) {
    return this.UserModel.findOne({ $or: [{ email: username }, { username }] })
      .select('password')
      .exec();
  }

  async getUser(username: string) {
    const user = await this.UserModel.findOne({
      $or: [{ email: username }, { username }],
    }).exec();
    if (!user) {
      return null;
    }
    return user;
  }

  async create(body: User) {
    return new this.UserModel(body).save();
  }

  async signUp(body: SignupDto) {
    return new this.UserModel(body).save();
  }

  async findAll() {
    return this.UserModel.find().exec();
  }

  async findOne(id: ObjectId) {
    return this.UserModel.findOne({ _id: id }).exec();
  }

  async deleteOne(id: ObjectId) {
    return this.UserModel.deleteOne({ _id: id }).exec();
  }

  async softDelete(id: ObjectId | any) {
    const user = await this.getUserById(id);
    if (user) {
      await this.UserModel.deleteById(id).exec();
      return true;
    }
    return false;
  }

  async update(id: ObjectId, body: User) {
    const update = body;
    if (body.password) {
      const salt = await bcrypt.genSalt();
      update.password = await bcrypt.hash(body.password, salt);
      update.salt = salt;
    }
    const condition = { _id: id };
    return this.UserModel.updateOne(condition, update, { new: true });
  }

  async findDeleted(id: ObjectId) {
    return this.UserModel.findOneWithDeleted({ _id: id }).exec();
  }

  async restoreDeleted(id: ObjectId) {
    return this.UserModel.restore({ _id: id });
  }
}
