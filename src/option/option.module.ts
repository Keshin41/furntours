import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';

@Module({
  imports: [PrismaModule],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
