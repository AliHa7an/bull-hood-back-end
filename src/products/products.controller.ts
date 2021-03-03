import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { createProductDTO } from './dto/products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  async create(@Body() product: createProductDTO) {
    const generatedId = await this.productService.create(product);
    return { id: generatedId };
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return 'Successfully Deleted';
  }

  @Patch(':id')
  updating(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('qty') qty: number,
    @Body('price') price: number,
  ) {
    this.productService.update(id, name, qty, price);
  }
}
