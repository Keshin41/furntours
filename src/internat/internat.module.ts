import { Module } from '@nestjs/common';
import { InternatController } from './internat.controller';
import { InternatService } from './internat.service';
import { StripeService } from 'src/payment/stripe.service';

@Module({
  controllers: [InternatController],
  providers: [StripeService, InternatService]
})
export class InternatModule {}
