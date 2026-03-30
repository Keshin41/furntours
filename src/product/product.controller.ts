import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getList(@Query('virtual') virtual?: string) {
    const isVirtual = virtual === 'true' ? true : virtual === 'false' ? false : undefined;
    return this.productService.findAll(isVirtual);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }
}
