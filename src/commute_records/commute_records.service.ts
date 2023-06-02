import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import dayjs, { Dayjs } from 'dayjs';
import { User } from 'src/auth/entity/user.entity';
import { Cron } from '@nestjs/schedule';
import { AuthRepository } from 'src/auth/auth.repository';
@Injectable()
export class CommuteRecordsService {
  constructor(
    @Inject(forwardRef(() => AuthRepository))
    private readonly authRepository: AuthRepository,
    private readonly commuteRecordsRepository: CommuteRecordsRepository,
  ) {}

  async createTodayRecordRow(user: User): Promise<void> {
    console.log(user);
    return await this.commuteRecordsRepository.createTodayRecordRow(user);
  }
  /**
   * 최근 7일 간의 기록 가져오기
   */
  async getRecentCommuteRecords(user: User): Promise<CommuteRecordDto[]> {
    return await this.commuteRecordsRepository.getRecentCommuteRecords(user);
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
    try {
      await this.commuteRecordsRepository.isCanAnnualHoliday(user);
      return this.commuteRecordsRepository.updateAnnualHoliday(user);
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

  /**
   * 월~금 오전 6시에 자동으로 ROW 생성
   */
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron('0 0 6 * * 1-5')
  async handleCron() {
    const userIdList = await this.authRepository.getUserList();
    const userValues = userIdList.map((v) => {
      return { today_date: dayjs().format('YYYY-MM-DD'), user: v.id };
    });
    return this.commuteRecordsRepository.insertAutoRecord(userValues);
  }
}
