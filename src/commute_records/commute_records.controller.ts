import { Controller, Get, Patch, Query, UseFilters } from '@nestjs/common';
import { CommuteRecordsService } from 'src/commute_records/commute_records.service';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { Dayjs } from 'dayjs';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';

@Controller('commute-records')
export class CommuteRecordsController {
  constructor(private commuteRecordsService: CommuteRecordsService) {}

  @Get('/recent')
  getRecentCommuteRecords(@GetUser() user: User): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsService.getRecentCommuteRecords(user);
  }

  @Patch('/arrive')
  @UseFilters(new HttpExceptionFilter())
  updateArriveTime(@GetUser() user: User): Promise<string> {
    return this.commuteRecordsService.updateArriveTime(user);
  }

  @Patch('/arrive/am')
  @UseFilters(new HttpExceptionFilter())
  updateAmArriveTime(@GetUser() user: User): Promise<string> {
    return this.commuteRecordsService.updateAmArriveTime(user);
  }

  @Patch('/leave')
  @UseFilters(new HttpExceptionFilter())
  updateLeaveTime(@GetUser() user: User): Promise<string> {
    return this.commuteRecordsService.updateLeaveTime(user);
  }

  @Patch('/leave/pm')
  @UseFilters(new HttpExceptionFilter())
  updatePmLeaveTime(@GetUser() user: User): Promise<string> {
    return this.commuteRecordsService.updatePmLeaveTime(user);
  }

  @Patch('/annual_holiday')
  @UseFilters(new HttpExceptionFilter())
  updateAnnualHoliday(@GetUser() user: User): Promise<void> {
    return this.commuteRecordsService.updateAnnualHoliday(user);
  }

  @Get('/week')
  @UseFilters(new HttpExceptionFilter())
  getCommuteRecordsOfWeek(
    @Query('mondayDate') mondayDate: Dayjs,
    @GetUser() user: User,
  ): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsService.getCommuteRecordsOfWeek(mondayDate, user);
  }
}
