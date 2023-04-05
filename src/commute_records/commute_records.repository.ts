import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs, { Dayjs } from 'dayjs';
import { User } from 'src/auth/entity/user.entity';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CommuteRecordsRepository extends Repository<CommuteRecord> {
  @InjectRepository(CommuteRecord)
  private readonly commuteRecordRepository: Repository<CommuteRecord>;

  async getRecentCommuteRecords(user: User): Promise<CommuteRecord[]> {
    const records = await this.commuteRecordRepository.find({
      where: {
        created_at: Between(
          dayjs().subtract(7, 'd').format(),
          dayjs().format(),
        ),
        user: user.id,
      },
    });
    return records;
  }

  async isAlreadyArrive(user: User): Promise<string> {
    const findRecord = await this.commuteRecordRepository.findOne({
      where: {
        today_date: dayjs().format('YYYY-MM-DD'),
        user: user.id,
      },
      select: ['today_date', 'arrive_time'],
    });
    // 자동으로 행이 생성 안된 경우
    if (findRecord === undefined) {
      throw new HttpException('당일 기록이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    // 이미 출근한 경우
    if (findRecord.arrive_time !== null) {
      throw new HttpException('이미 출근하였습니다.', HttpStatus.BAD_REQUEST);
    }
    // 출근 기록이 없는 경우
    return dayjs().format();
  }

  async isAlreadyLeave(user: User): Promise<CommuteRecord> {
    const recentRecord = await this.commuteRecordRepository.findOne({
      where: {
        user: user.id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    // 자동으로 행이 생성 안된 경우
    if (recentRecord === undefined) {
      throw new HttpException('당일 기록이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    // 출근을 안한 경우
    if (recentRecord.arrive_time === null) {
      throw new HttpException(
        '출근을 하지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 이미 퇴근한 경우
    if (recentRecord.leave_time !== null) {
      throw new HttpException('이미 퇴근하였습니다.', HttpStatus.BAD_REQUEST);
    }
    return recentRecord;
  }

  async updateArriveTime(isAm: boolean, user: User): Promise<string> {
    await this.commuteRecordRepository
      .createQueryBuilder()
      .update(CommuteRecord)
      .set({
        arrive_time: dayjs().format(),
        is_am: isAm,
      })
      .where('today_date = :today_date', {
        today_date: dayjs().format('YYYY-MM-DD'),
      })
      .where('user_id = :user_id', {
        user_id: user.id,
      })
      .execute();
    return dayjs().format();
  }

  async updateLeaveTime(
    record: CommuteRecord,
    isPm: boolean,
    user: User,
  ): Promise<string> {
    const { id, arrive_time, is_am } = record;
    const addAmWorkTime = is_am ? 240 : 0;
    const addPmWorkTime = isPm ? 240 : 0;
    await this.commuteRecordRepository
      .createQueryBuilder()
      .update(CommuteRecord)
      .set({
        leave_time: dayjs().format(),
        work_time:
          dayjs().startOf('m').diff(dayjs(arrive_time).startOf('m'), 'm') +
          addAmWorkTime +
          addPmWorkTime,
        is_pm: isPm ? true : false,
      })
      .where('id = :id', { id: id })
      .where('user_id = :user_id', { user_id: user.id })
      .execute();

    return dayjs().format();
  }

  async insertTestRecord(insertTestRecordDto: InsertTestRecordDto) {
    const {
      arrive_time,
      today_date,
      work_time,
      leave_time,
      is_pm,
      is_am,
      is_annual,
    } = insertTestRecordDto;
    const record = await this.commuteRecordRepository.create({
      arrive_time,
      today_date,
      work_time,
      leave_time,
      is_pm,
      is_am,
      is_annual,
    });
    await this.commuteRecordRepository.save(record);
  }

  async getCommuteRecordsOfWeek(mondayDate: Dayjs, user: User) {
    const records = await this.commuteRecordRepository.find({
      where: {
        created_at: Between(
          dayjs(mondayDate).subtract(5, 'd').format(),
          dayjs(mondayDate).format(),
        ),
        user: user.id,
      },
      order: {
        created_at: 'ASC',
      },
    });
    return records;
  }
}
