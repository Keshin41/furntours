import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InternatService } from './internat.service';

@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}



  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async processTickets(@Body() data: any): Promise<any> {
    return this.internatService.processOrder(data);
  }
}
