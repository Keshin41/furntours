import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import type { CreateProductDto, UpdateProductDto } from './product.type';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getList(@Query('virtual') virtual?: string) {
    const isVirtual =
      virtual === 'true' ? true : virtual === 'false' ? false : undefined;
    return this.productService.findAll(isVirtual);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Put('/:id')
  updateById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateById(id, updateProductDto);
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}
