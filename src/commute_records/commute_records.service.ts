import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { CommuteRecordDto } from 'src/commute_records/dto/get-commute_record.dto';
import { InsertTestRecordDto } from 'src/commute_records/dto/insert-test_record.dto';

@Injectable()
export class CommuteRecordsService {
  constructor(
    private readonly commuteRecordsRepository: CommuteRecordsRepository,
  ) {}

  /**
   * 최근 7일 간의 기록 가져오기
   */
  getRecentCommuteRecords(): Promise<CommuteRecordDto[]> {
    return this.commuteRecordsRepository.getRecentCommuteRecords();
  }

  /**
   * 출근하기 기능
   */
  updateArriveTime(): Promise<string> {
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Some error description',
    });
    this.commuteRecordsRepository.isAlreadyArrive().then((res) => {
      if (res) {
        // throw new HttpException('이미 출근하셨습니다.', HttpStatus.BAD_REQUEST);
        throw new BadRequestException('Something bad happened', {
          cause: new Error(),
          description: 'Some error description',
        });
        // throw new HttpException('이미 출근하셨습니다.', Http);
      }
      return this.commuteRecordsRepository.updateArriveTime();
    });
    // return;
    // console.log(isAlready);
    // if (isAlready) {
    //   /**
    //    * status: 200
    //    * message: '이미 출근하셨습니다.'
    //    */
    //   throw new NotFoundException('이미 출근하셨습니다.');
    // }
    return this.commuteRecordsRepository.updateArriveTime();
  }

  /**
   * 오전 반차 기능
   */
  // updateAmArriveTime(): Promise<string> {
  // return this.
  // }

  /**
   * 퇴근하기 기능
   */
  updateLeaveTime(): Promise<string> {
    return this.commuteRecordsRepository.updateLeaveTime();
  }

  insertTestRecord(insertTestRecordDto: InsertTestRecordDto) {
    return this.commuteRecordsRepository.insertTestRecord(insertTestRecordDto);
  }
}

/**
 * 해당 주의 기록 가져오기
 */
// getCommuteRecordsOfWeek(mondayDate: Dayjs) {
//   return this.commuteRecords;
// }
