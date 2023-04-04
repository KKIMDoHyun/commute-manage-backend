import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from 'src/auth/dto/user-signUp.dto';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserSignInDto } from 'src/auth/dto/user-signIn.dto';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';

@Injectable()
export class AuthRepository extends Repository<User> {
  @InjectRepository(User)
  private readonly authRepository: Repository<User>;

  async findUser(email: string): Promise<boolean> {
    const foundUser = await this.authRepository.findOne({ email });
    return foundUser ? true : false;
  }

  async signUp(userSignUpDto: UserSignUpDto): Promise<User> {
    const { email, name, password, team, position } = userSignUpDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.authRepository.create({
      email,
      name,
      password: hashedPassword,
      team,
      position,
    });
    try {
      await this.authRepository.save(user);
      return user;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('해당 계정이 이미 존재합니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(userSignInDto: UserSignInDto): Promise<UserInfoDto> {
    const { email, password } = userSignInDto;
    const user = await this.authRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호를 잘못 입력했습니다!',
      );
    }
  }
}
