import { Module } from '@nestjs/common';
import { SkuController } from './sku.controller';
import { SkuService } from './sku.service';

@Module({
  imports: [],
  providers: [SkuService],
  controllers: [SkuController],
})
export class SkuModule {}
