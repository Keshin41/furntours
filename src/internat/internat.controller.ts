import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TicketListDto } from './internat.dto';
import { InternatService } from './internat.service';

@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/maxTickets')
  checkStock(): Promise<any> {
    return this.internatService.maxTickets();
  }
  
  @Get('/list')
  @UseGuards(AuthGuard)
  getList(): Promise<TicketListDto[]> {
    return this.internatService.getList();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async processTickets(@Body() data: any): Promise<any> {
    return this.internatService.processOrder(data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/checkout/:paymentIntentId')
  async cancelOrder(@Param('paymentIntentId') paymentIntentId: string): Promise<void> {
    return this.internatService.cancelOrder(paymentIntentId);
  }
}
