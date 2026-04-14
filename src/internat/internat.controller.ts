import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InternatService } from './internat.service';

@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/maxTickets')
  async checkStock(): Promise<any> {
    return this.internatService.maxTickets();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async processTickets(@Body() data: any): Promise<any> {
    return this.internatService.processOrder(data);
  }
}