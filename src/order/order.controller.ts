import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';
import { OrderStatus } from 'src/generated/prisma/client';

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
  getById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
