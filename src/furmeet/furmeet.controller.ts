import { Controller, Get, Param } from '@nestjs/common';
import { FurmeetService } from './furmeet.service';

@Controller('furmeet')
export class FurmeetController {
  constructor(private readonly furmeetService: FurmeetService) {}

  @Get('/')
  getList() {
    return this.furmeetService.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.furmeetService.findById(id);
  }
}
