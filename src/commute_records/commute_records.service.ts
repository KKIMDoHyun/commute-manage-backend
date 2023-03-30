import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Dayjs } from 'dayjs';
import { CreateCommuteRecordDto } from 'src/commute_records/dto/create-commute_record.dto';
import { TCommuteRecord } from 'src/commute_records/type/commute_record.type';
import { v1 as uuid } from 'uuid';

@Injectable()
export class CommuteRecordsService {
  private commuteRecords: TCommuteRecord[] = [];

  getAllCommuteRecords(): TCommuteRecord[] {
    return this.commuteRecords;
  }

  /**
   * 출근하기 기능
   */
  createCommuteRecord(createCommuteRecordDto: CreateCommuteRecordDto) {
    const { arrive_time } = createCommuteRecordDto;
    const record = {
      arrive_time,
    };
    // this.commuteRecords.push(record);
  }

  /**
   * 해당 주의 기록 가져오기
   */
  getCommuteRecordsOfWeek(mondayDate: Dayjs) {
    return this.commuteRecords;
  }
}
