import { BadRequestException, Injectable } from '@nestjs/common';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';
import { Dayjs } from 'dayjs';
import { User } from 'src/auth/entity/user.entity';
@Injectable()
export class CommuteRecordsService {
  constructor(
    private readonly commuteRecordsRepository: CommuteRecordsRepository,
  ) {}

  /**
   * 최근 7일 간의 기록 가져오기
   */
  getRecentCommuteRecords(user: User): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsRepository.getRecentCommuteRecords(user);
  }

  /**
   * 출근하기 기능
   */
  async updateArriveTime(user: User): Promise<string> {
    try {
      await this.commuteRecordsRepository.isAlreadyArrive(user);
      return this.commuteRecordsRepository.updateArriveTime(false, user);
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
  async updateAmArriveTime(user: User): Promise<string> {
    try {
      await this.commuteRecordsRepository.isAlreadyArrive(user);
      return this.commuteRecordsRepository.updateArriveTime(true, user);
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
  async updateLeaveTime(user: User): Promise<string> {
    try {
      const recentRecord = await this.commuteRecordsRepository.isAlreadyLeave(
        user,
      );
      return this.commuteRecordsRepository.updateLeaveTime(
        recentRecord,
        false,
        user,
      );
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
  async updatePmLeaveTime(user: User): Promise<string> {
    try {
      const recentRecord = await this.commuteRecordsRepository.isAlreadyLeave(
        user,
      );
      return this.commuteRecordsRepository.updateLeaveTime(
        recentRecord,
        true,
        user,
      );
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
   * 월요일부터 5일 간의 기록 가져오기
   */
  getCommuteRecordsOfWeek(
    mondayDate: Dayjs,
    user: User,
  ): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsRepository.getCommuteRecordsOfWeek(
      mondayDate,
      user,
    );
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
