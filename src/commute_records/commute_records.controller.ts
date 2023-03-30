import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommuteRecordsService } from 'src/commute_records/commute_records.service';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';

@Controller('commute-records')
export class CommuteRecordsController {
  constructor(private commuteRecordsService: CommuteRecordsService) {}

  @Get('/')
  getAllCommuteRecords(): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsService.getRecentCommuteRecords();
  }

  @Post('/arrive')
  updateArriveTime() {
    return this.commuteRecordsService.updateArriveTime();
  }

  // @Get('/:mondayDate')
  // getCommuteRecordsOfWeek(
  //   @Param('mondayDate') mondayDate: Dayjs,
  // ): TCommuteRecord[] {
  //   return this.commuteRecordsService.getCommuteRecordsOfWeek(mondayDate);
  // }

  @Post('/')
  insertTestRecord(@Body() insertTestRecordDto: InsertTestRecordDto) {
    return this.commuteRecordsService.insertTestRecord(insertTestRecordDto);
  }
}
