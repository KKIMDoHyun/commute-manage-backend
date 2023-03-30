export class CreateCommuteRecordDto {
  id: number;
  created_at: string;
  today_date: string;
  arrive_time: string;
  leave_time: string | null;
  work_time: number;
  is_am: boolean;
  is_pm: boolean;
  is_full: boolean;
}
