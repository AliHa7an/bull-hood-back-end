import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  qty: Number,
  price: Number,
});
