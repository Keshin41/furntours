import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductService } from './product.service';
import type { CreateProductDto, UpdateProductDto } from './product.type';

const productUploadDir = join(process.cwd(), 'uploads', 'products');

const ensureProductUploadDir = () => {
  if (!existsSync(productUploadDir)) {
    mkdirSync(productUploadDir, { recursive: true });
  }
};

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

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateById(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureProductUploadDir();
          cb(null, productUploadDir);
        },
        filename: (_req, file, cb) => {
          const extension = extname(file.originalname || '').toLowerCase();
          cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype?.startsWith('image/')) {
          cb(null, true);
          return;
        }
        cb(new BadRequestException('Only image files are allowed'), false);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: { filename: string } | undefined,
    @Req() req: { protocol: string; get: (name: string) => string | undefined },
  ) {
    if (!file?.filename) {
      throw new BadRequestException('Image file is required');
    }

    return {
      url: `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`,
    };
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}
