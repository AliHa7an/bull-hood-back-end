import { Injectable, NotFoundException } from '@nestjs/common';
import { createProductDTO } from './dto/products.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<product>,
  ) {}
  products: product[] = [];

  async create(prd: createProductDTO) {
    const newProduct = new this.productModel({
      name: prd.name,
      qty: prd.qty,
      price: prd.price,
    });
    const result = await newProduct.save();
    return result._id as string;
  }

  async findAll() {
    const allProduct = await this.productModel.find().exec();
    return allProduct.map((p) => ({
      id: p._id,
      name: p.name,
      quantity: p.qty,
      price: p.price,
    }));
  }

  async findOne(id: string) {
    const prod = await this.findProduct(id);
    return {
      id: prod._id,
      name: prod.name,
      Quantity: prod.qty,
      price: prod.price,
    };
  }

  async update(id: string, name: string, qty: number, price: number) {
    const updatedProd = await this.findProduct(id);
    if (name) updatedProd.name = name;
    if (qty) updatedProd.qty = qty;
    if (price) updatedProd.price = price;
    updatedProd.save();
  }

  async deleteProduct(id: string) {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.n === 0) throw new NotFoundException('could not find product');
  }

  private async findProduct(id: string): Promise<product> {
    let prod;
    try {
      prod = await this.productModel.findById(id);
    } catch (error) {
      throw new NotFoundException('product is not found');
    }

    if (!prod) throw new NotFoundException('Not found this product');
    else return prod;
  }
}
