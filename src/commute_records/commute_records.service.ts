import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import dayjs, { Dayjs } from 'dayjs';
import { CreateCommuteRecordDto } from 'src/commute_records/dto/create-commute_record.dto';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Between, Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';

@Injectable()
export class CommuteRecordsService {
  @InjectRepository(CommuteRecord)
  private readonly commuteRecordRepository: Repository<CommuteRecord>;

  /**
   * 최근 7일 간의 기록 가져오기
   */
  async getRecentCommuteRecords(): Promise<CommuteRecord[]> {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const records = this.commuteRecordRepository.find({
      where: {
        created_at: Between(new Date(year, month, day - 7), new Date()),
      },
    });
    return records;
  }

  /**
   * 출근하기 기능
   */
  // createCommuteRecord(createCommuteRecordDto: CreateCommuteRecordDto) {
  //   const { arrive_time } = createCommuteRecordDto;
  //   const record = {
  //     arrive_time,
  //   };
  //   // this.commuteRecords.push(record);
  // }
}

/**
 * 해당 주의 기록 가져오기
 */
// getCommuteRecordsOfWeek(mondayDate: Dayjs) {
//   return this.commuteRecords;
// }
