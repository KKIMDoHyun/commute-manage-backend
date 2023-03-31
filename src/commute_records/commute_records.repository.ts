import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { NotFoundError } from 'rxjs';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CommuteRecordsRepository extends Repository<CommuteRecord> {
  @InjectRepository(CommuteRecord)
  private readonly commuteRecordRepository: Repository<CommuteRecord>;

  async getRecentCommuteRecords(): Promise<CommuteRecord[]> {
    const records = await this.commuteRecordRepository.find({
      where: {
        created_at: Between(
          dayjs().subtract(7, 'd').format(),
          dayjs().format(),
        ),
      },
    });
    return records;
  }

  async isAlreadyArrive(): Promise<boolean> {
    const findRecord = await this.commuteRecordRepository.findOne({
      where: {
        today_date: dayjs().format('YYYY-MM-DD'),
      },
      select: ['today_date', 'arrive_time'],
    });
    // 자동으로 행이 생성 안된 경우
    if (findRecord === undefined) {
      throw new Error('해당 기록을 찾을 수 없습니다.');
    }
    // 이미 출근한 경우
    if (findRecord.arrive_time !== null) {
      return true;
    }
    // 출근 기록이 없는 경우
    return false;
  }

  async isAlreadyLeave(): Promise<boolean> {
    const findRecord = await this.commuteRecordRepository.findOne({
      where: {
        today_date: dayjs().format('YYYY-MM-DD'),
      },
      select: ['today_date', 'arrive_time', 'leave_time'],
    });
    // 자동으로 행이 생성 안된 경우
    if (findRecord === undefined) {
    }
    // 출근을 안한 경우
    if (findRecord.arrive_time === null) {
    }
    // 이미 퇴근한 경우
    if (findRecord.leave_time === null) {
      return true;
    }
    return false;
  }

  async updateArriveTime(): Promise<string> {
    await this.commuteRecordRepository
      .createQueryBuilder()
      .update(CommuteRecord)
      .set({
        arrive_time: dayjs().format(),
      })
      .where('today_date = :today_date', {
        today_date: dayjs().format('YYYY-MM-DD'),
      })
      .execute();
    return dayjs().format();
  }

  async updateLeaveTime(): Promise<string> {
    const findRecord = await this.commuteRecordRepository.findOne({
      where: {
        today_date: dayjs().format('YYYY-MM-DD'),
      },
      select: ['arrive_time'],
    });

    if (!findRecord) {
      throw new Error('출근하지 않았습니다.');
    }

    await this.commuteRecordRepository
      .createQueryBuilder()
      .update(CommuteRecord)
      .set({
        leave_time: dayjs().format(),
        work_time: dayjs().diff(dayjs(findRecord.arrive_time), 'm'),
      })
      .where('today_date = :today_date', {
        today_date: dayjs().format('YYYY-MM-DD'),
      })
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
      is_full,
    } = insertTestRecordDto;
    const record = await this.commuteRecordRepository.create({
      arrive_time,
      today_date,
      work_time,
      leave_time,
      is_pm,
      is_am,
      is_full,
    });
    await this.commuteRecordRepository.save(record);
  }
}
