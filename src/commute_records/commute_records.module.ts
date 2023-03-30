import { Module } from '@nestjs/common';
import { CommuteRecordsService } from './commute_records.service';
import { CommuteRecordsController } from './commute_records.controller';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommuteRecord])],
  providers: [CommuteRecordsService, CommuteRecordsRepository],
  controllers: [CommuteRecordsController],
})
export class CommuteRecordsModule {}
