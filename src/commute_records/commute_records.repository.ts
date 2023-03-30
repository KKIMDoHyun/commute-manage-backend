import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { NotFoundError } from 'rxjs';
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

  async updateArriveTime(): Promise<boolean> {
    const findRecord = await this.commuteRecordRepository.findOne({
      where: {
        today_date: dayjs().format('YYYY-MM-DD'),
      },
      select: ['arrive_time'],
    });

    if (findRecord) {
      throw new Error('이미 출근하셨습니다.');
    }

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

    return true;
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
