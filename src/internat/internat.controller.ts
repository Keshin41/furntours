import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InternatService } from './internat.service';

@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/validate')
  async validateTickets(@Body() data: any): Promise<any> {
    return this.internatService.validateTickets(data);
  }


  @Get('/tickets')
  async getTickets(): Promise<any> {
    return this.internatService.getTickets();
  }


  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async processTickets(@Body() _data: any): Promise<any> {
    return this.internatService.processOrder();
  }
}
