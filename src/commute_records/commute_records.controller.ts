import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CommuteRecordsService } from 'src/commute_records/commute_records.service';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';
import { Dayjs } from 'dayjs';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';

@Controller('commute-records')
export class CommuteRecordsController {
  constructor(private commuteRecordsService: CommuteRecordsService) {}

  @Get('/')
  getAllCommuteRecords(): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsService.getRecentCommuteRecords();
  }

  @Patch('/arrive')
  @UseFilters(new HttpExceptionFilter())
  updateArriveTime(): Promise<string> {
    return this.commuteRecordsService.updateArriveTime();
  }

  @Patch('/arrive/am')
  @UseFilters(new HttpExceptionFilter())
  updateAmArriveTime(): Promise<string> {
    return this.commuteRecordsService.updateAmArriveTime();
  }

  @Patch('/leave')
  @UseFilters(new HttpExceptionFilter())
  updateLeaveTime(): Promise<string> {
    return this.commuteRecordsService.updateLeaveTime();
  }

  @Patch('/leave/pm')
  @UseFilters(new HttpExceptionFilter())
  updatePmLeaveTime(): Promise<string> {
    return this.commuteRecordsService.updatePmLeaveTime();
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
