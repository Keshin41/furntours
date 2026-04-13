import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateSkuDto } from './sku.dto';
import { SkuService } from './sku.service';

@UseGuards(AuthGuard)
@Controller('sku')
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @Put('/:id')
  updateById(@Param('id') id: string, @Body() dto: UpdateSkuDto) {
    return this.skuService.updateById(id, dto);
  }
}
