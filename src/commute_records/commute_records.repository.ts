import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Between, EntityRepository, Repository } from 'typeorm';

@Injectable()
export class CommuteRecordsRepository extends Repository<CommuteRecord> {
  @InjectRepository(CommuteRecord)
  private readonly commuteRecordRepository: Repository<CommuteRecord>;

  async getRe(): Promise<CommuteRecord[]> {
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
}
