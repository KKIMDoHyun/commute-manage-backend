import { Dayjs } from 'dayjs';
export class CommuteRecordDto {
  id: number;
  today_date: string;
  arrive_time: Dayjs;
  leave_time: Dayjs | null;
  work_time: number;
  is_am: boolean;
  is_pm: boolean;
  is_annual: boolean;
}
