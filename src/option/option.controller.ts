import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateOptionTypeDto,
  CreateOptionValueDto,
  UpdateOptionTypeDto,
  UpdateOptionValueDto,
} from './option.dto';
import { OptionService } from './option.service';

@UseGuards(AuthGuard)
@Controller('/option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('type/:productId')
  createOptionType(
    @Param('productId') productId: string,
    @Body() dto: CreateOptionTypeDto,
  ) {
    return this.optionService.createOptionType(productId, dto);
  }

  @Put('type/:id')
  updateOptionType(@Param('id') id: string, @Body() dto: UpdateOptionTypeDto) {
    return this.optionService.updateOptionType(id, dto);
  }

  @Delete('type/:id')
  deleteOptionType(@Param('id') id: string) {
    return this.optionService.deleteOptionType(id);
  }

  @Post('value/:optionTypeId')
  createOptionValue(
    @Param('optionTypeId') optionTypeId: string,
    @Body() dto: CreateOptionValueDto,
  ) {
    return this.optionService.createOptionValue(optionTypeId, dto);
  }

  @Put('value/:id')
  updateOptionValue(
    @Param('id') id: string,
    @Body() dto: UpdateOptionValueDto,
  ) {
    return this.optionService.updateOptionValue(id, dto);
  }

  @Delete('value/:id')
  deleteOptionValue(@Param('id') id: string) {
    return this.optionService.deleteOptionValue(id);
  }
}
