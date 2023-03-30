import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { UpdateCommuteRecordDto } from 'src/commute_records/dto/update-commute_record.dto';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Between, Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';

@Injectable()
export class CommuteRecordsService {
  constructor(
    private readonly commuteRecordsRepository: CommuteRecordsRepository,
  ) {}

  /**
   * 최근 7일 간의 기록 가져오기
   */
  getRecentCommuteRecords(): Promise<CommuteRecord[]> {
    return this.commuteRecordsRepository.getRe();
  }

  /**
   * 출근하기 기능
   */
  updateArriveTime(updateCommuteRecordDto: UpdateCommuteRecordDto) {
    const { arrive_time } = updateCommuteRecordDto;
    const record = {
      arrive_time,
    };
    // this.commuteRecords.push(record);
  }
}

/**
 * 해당 주의 기록 가져오기
 */
// getCommuteRecordsOfWeek(mondayDate: Dayjs) {
//   return this.commuteRecords;
// }
