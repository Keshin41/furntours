import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/list')
  getList(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.orderService.list(
      Number.parseInt(page),
      Number.parseInt(pageSize),
    );
  }

  @Get('/count')
  getCount() {
    return this.orderService.count();
  }

  @Get('/:id')
  getById() {
    return 'This action returns a order by id';
  }
}
