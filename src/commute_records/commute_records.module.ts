import { Module, forwardRef } from '@nestjs/common';
import { CommuteRecordsService } from './commute_records.service';
import { CommuteRecordsController } from './commute_records.controller';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommuteRecordsRepository } from 'src/commute_records/commute_records.repository';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entity/user.entity';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommuteRecord]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [CommuteRecordsService, CommuteRecordsRepository, AuthRepository],
  controllers: [CommuteRecordsController],
  exports: [CommuteRecordsService],
})
export class CommuteRecordsModule {}
