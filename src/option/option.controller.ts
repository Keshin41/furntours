import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';

import {
  CreateOptionTypeDto,
  CreateOptionValueDto,
  UpdateOptionTypeDto,
  UpdateOptionValueDto,
} from './option.dto';
import { OptionService } from './option.service';

@Controller('/option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  // ── Option Types ────────────────────────────────────────────────────────────

  // POST /product/:productId/option-type
  @Post('type/:productId')
  createOptionType(
    @Param('productId') productId: string,
    @Body() dto: CreateOptionTypeDto,
  ) {
    return this.optionService.createOptionType(productId, dto);
  }

  // PUT /option-type/:id
  @Put('type/:id')
  updateOptionType(@Param('id') id: string, @Body() dto: UpdateOptionTypeDto) {
    return this.optionService.updateOptionType(id, dto);
  }

  // DELETE /option-type/:id
  @Delete('type/:id')
  deleteOptionType(@Param('id') id: string) {
    return this.optionService.deleteOptionType(id);
  }

  // ── Option Values ───────────────────────────────────────────────────────────

  // POST /option-type/:optionTypeId/option-value
  @Post('value/:optionTypeId')
  createOptionValue(
    @Param('optionTypeId') optionTypeId: string,
    @Body() dto: CreateOptionValueDto,
  ) {
    return this.optionService.createOptionValue(optionTypeId, dto);
  }

  // PUT /option-value/:id
  @Put('value/:id')
  updateOptionValue(
    @Param('id') id: string,
    @Body() dto: UpdateOptionValueDto,
  ) {
    return this.optionService.updateOptionValue(id, dto);
  }

  // DELETE /option-value/:id
  @Delete('value/:id')
  deleteOptionValue(@Param('id') id: string) {
    return this.optionService.deleteOptionValue(id);
  }
}
