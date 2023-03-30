import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Between, EntityRepository, Repository } from 'typeorm';

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

  // 오전 6시에 빈 행이 생성되었다고 가정. created_at과 today_date(YYYY-MM-DD)를 채워.
  // 출근하기 버튼을 누르면 today_date === dayjs().format('YYYY-MM-DD') 비교 후 지금 도착시간을 arrive_time에 넣어야함
  async updateArriveTime(): Promise<CommuteRecord[]> {
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

    const temp = await this.commuteRecordRepository.find();
    return temp;
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
