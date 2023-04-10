import { BadRequestException, Injectable } from '@nestjs/common';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';
import dayjs, { Dayjs } from 'dayjs';
import { User } from 'src/auth/entity/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthRepository } from 'src/auth/auth.repository';
@Injectable()
export class CommuteRecordsService {
  constructor(
    private readonly authRepository: AuthRepository,
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
   * 연차 기능
   */
  async updateAnnualHoliday(user: User): Promise<void> {
    return this.commuteRecordsRepository.updateAnnualHoliday(user);
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

  /**
   * 월~금 오전 6시에 자동으로 ROW 생성
   */
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron('0 0 6 * * 1-5')
  async handleCron() {
    const userList = await this.authRepository.getUserList();
    const temp = userList.map((v) => {
      return { today_date: dayjs().format('YYYY-MM-DD'), user: v.id };
    });
    console.log(temp);
    return this.commuteRecordsRepository.insertAutoRecord(temp);
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
