import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignUpInputDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @MinLength(4, { message: '비밀번호는 최소 4자 이상 입력해야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 15자 이하 입력해야 합니다.' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영어와 숫자로만 이루어져 있어야 합니다.',
  })
  readonly password: string;

  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상 입력해야 합니다.' })
  @MaxLength(10, { message: '이름은 최대 10자 이하 입력해야 합니다.' })
  readonly name: string;
}
