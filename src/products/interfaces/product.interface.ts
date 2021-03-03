import { Document } from 'mongoose';

export interface product extends Document {
  name?: string;
  qty?: number;
  price?: number;
}
