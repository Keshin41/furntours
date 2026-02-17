import { Module } from '@nestjs/common';
import { FurmeetController } from './furmeet.controller';
import { FurmeetService } from './furmeet.service';

@Module({
  imports: [],
  providers: [FurmeetService],
  controllers: [FurmeetController],
})
export class FurmeetModule {}
