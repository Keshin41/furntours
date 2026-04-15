import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
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
import { UpdateSkuDto } from './sku.dto';
import { SkuService } from './sku.service';

const skuUploadDir = join(process.cwd(), 'uploads', 'skus');

const ensureSkuUploadDir = () => {
  if (!existsSync(skuUploadDir)) {
    mkdirSync(skuUploadDir, { recursive: true });
  }
};

@UseGuards(AuthGuard)
@Controller('sku')
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureSkuUploadDir();
          cb(null, skuUploadDir);
        },
        filename: (_req, file, cb) => {
          const extension = extname(file.originalname || '').toLowerCase();
          cb(null, `sku-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
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
      url: `${req.protocol}://${req.get('host')}/uploads/skus/${file.filename}`,
    };
  }

  @Put('/:id')
  updateById(@Param('id') id: string, @Body() dto: UpdateSkuDto) {
    return this.skuService.updateById(id, dto);
  }
}
