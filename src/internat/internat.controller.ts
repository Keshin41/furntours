import {
  Body,
  Controller,
  Get,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  InternatCheckoutDto,
  InternatCheckoutResponseDto,
  MaxTicketsDto,
  TicketListDto,
} from './internat.dto';
import { InternatService } from './internat.service';

@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/maxTickets')
  checkStock(): Promise<MaxTicketsDto> {
    return this.internatService.maxTickets();
  }
  
  @Get('/list')
  @UseGuards(AuthGuard)
  getList(): Promise<TicketListDto[]> {
    return this.internatService.getList();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async processTickets(
    @Body() data: InternatCheckoutDto,
  ): Promise<InternatCheckoutResponseDto> {
    return this.internatService.processOrder(data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/checkout/:paymentIntentId')
  async cancelOrder(
    @Param('paymentIntentId') paymentIntentId: string,
    @Headers('x-cancel-token') cancelToken?: string,
  ): Promise<void> {
    return this.internatService.cancelOrder(paymentIntentId, cancelToken);
  }
}
