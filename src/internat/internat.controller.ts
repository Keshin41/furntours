import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InternatService } from './internat.service';

@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}



  @HttpCode(HttpStatus.OK)
  @Post('/procceed')
  async processTickets(@Body() data: any): Promise<any> {
    this.internatService.manageTest(data);
  }
}
