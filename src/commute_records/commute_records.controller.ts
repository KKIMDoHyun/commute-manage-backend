import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Dayjs } from 'dayjs';
import { CommuteRecordsService } from 'src/commute_records/commute_records.service';
import { CreateCommuteRecordDto } from 'src/commute_records/dto/create-commute_record.dto';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';

@Controller('commute-records')
export class CommuteRecordsController {
  constructor(private commuteRecordsService: CommuteRecordsService) {}

  @Get('/')
  getAllCommuteRecords(): Promise<CommuteRecord[]> {
    return this.commuteRecordsService.getRecentCommuteRecords();
  }

  // @Post('/')
  // createCommuteRecord(@Body() createCommuteRecordDto: CreateCommuteRecordDto) {
  //   return this.commuteRecordsService.createCommuteRecord(
  //     createCommuteRecordDto,
  //   );
  // }

  // @Get('/:mondayDate')
  // getCommuteRecordsOfWeek(
  //   @Param('mondayDate') mondayDate: Dayjs,
  // ): TCommuteRecord[] {
  //   return this.commuteRecordsService.getCommuteRecordsOfWeek(mondayDate);
  // }
}
