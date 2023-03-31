import { BadRequestException, Injectable } from '@nestjs/common';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';

@Injectable()
export class CommuteRecordsService {
  constructor(
    private readonly commuteRecordsRepository: CommuteRecordsRepository,
  ) {}

  /**
   * 최근 7일 간의 기록 가져오기
   */
  getRecentCommuteRecords(): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsRepository.getRecentCommuteRecords();
  }

  /**
   * 출근하기 기능
   */
  async updateArriveTime(): Promise<string> {
    try {
      await this.commuteRecordsRepository.isAlreadyArrive();
      return this.commuteRecordsRepository.updateArriveTime();
    } catch (err) {
      if (err.status === 400) {
        throw new BadRequestException(err.response, {
          cause: new Error(),
          description: err.response,
        });
      }
    }
  }

  /**
   * 오전 반차 기능
   */
  async updateAmArriveTime(): Promise<string> {
    try {
      await this.commuteRecordsRepository.isAlreadyArrive();
      return this.commuteRecordsRepository.updateArriveTime(true);
    } catch (err) {
      if (err.status === 400) {
        throw new BadRequestException(err.response, {
          cause: new Error(),
          description: err.response,
        });
      }
    }
  }

  /**
   * 퇴근하기 기능
   */
  async updateLeaveTime(): Promise<string> {
    try {
      const recentRecord = await this.commuteRecordsRepository.isAlreadyLeave();
      return this.commuteRecordsRepository.updateLeaveTime(recentRecord);
    } catch (err) {
      if (err.status === 400) {
        throw new BadRequestException(err.response, {
          cause: new Error(),
          description: err.response,
        });
      }
    }
  }

  /**
   * 오후 반차 기능
   */
  async updatePmLeaveTime(): Promise<string> {
    try {
      const recentRecord = await this.commuteRecordsRepository.isAlreadyLeave();
      return this.commuteRecordsRepository.updateLeaveTime(recentRecord, true);
    } catch (err) {
      if (err.status === 400) {
        throw new BadRequestException(err.response, {
          cause: new Error(),
          description: err.response,
        });
      }
    }
  }

  insertTestRecord(insertTestRecordDto: InsertTestRecordDto) {
    return this.commuteRecordsRepository.insertTestRecord(insertTestRecordDto);
  }
}

/**
 * 해당 주의 기록 가져오기
 */
// getCommuteRecordsOfWeek(mondayDate: Dayjs) {
//   return this.commuteRecords;
// }
