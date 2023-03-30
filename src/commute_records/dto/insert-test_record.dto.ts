import { Dayjs } from 'dayjs';

export class InsertTestRecordDto {
  today_date: string;
  arrive_time: Dayjs | null;
  leave_time: Dayjs | null;
  work_time: number;
  is_am: boolean;
  is_pm: boolean;
  is_full: boolean;
}
