import { Module } from '@nestjs/common';
import { CommuteRecordsService } from './commute_records.service';
import { CommuteRecordsController } from './commute_records.controller';

@Module({
  providers: [CommuteRecordsService],
  controllers: [CommuteRecordsController],
})
export class CommuteRecordsModule {}
