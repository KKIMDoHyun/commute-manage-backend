import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Dayjs } from 'dayjs';
import { CommuteRecordsService } from 'src/commute_records/commute_records.service';
import { CreateCommuteRecordDto } from 'src/commute_records/dto/create-commute_record.dto';
import { TCommuteRecord } from 'src/commute_records/type/commute_record.type';

@Controller('commute-records')
export class CommuteRecordsController {
  constructor(private commuteRecordsService: CommuteRecordsService) {}

  @Get('/')
  getAllCommuteRecords(): TCommuteRecord[] {
    return this.commuteRecordsService.getAllCommuteRecords();
  }

  @Post('/')
  createCommuteRecord(@Body() createCommuteRecordDto: CreateCommuteRecordDto) {
    return this.commuteRecordsService.createCommuteRecord(
      createCommuteRecordDto,
    );
  }

  @Get('/:mondayDate')
  getCommuteRecordsOfWeek(
    @Param('mondayDate') mondayDate: Dayjs,
  ): TCommuteRecord[] {
    return this.commuteRecordsService.getCommuteRecordsOfWeek(mondayDate);
  }
}
