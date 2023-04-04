import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PositionType } from 'src/auth/type/position.type';

export class UserInfoDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  readonly name: string;

  @IsNotEmpty()
  readonly team: string;

  @IsNotEmpty()
  readonly position: PositionType;

  readonly currentHashedRefreshToken?: string;
}
