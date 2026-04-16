import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from 'config/configuration';
import { AnnouncementModule } from './announcement/announcement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { InternatModule } from './internat/internat.module';
import { LoggerMiddleware } from './logger.middleware';
import { OptionModule } from './option/option.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { SkuModule } from './sku/sku.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    AnnouncementModule,
    ProductModule,
    PaymentModule,
    OrderModule,
    EventModule,
    OptionModule,
    InternatModule,
    SkuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
