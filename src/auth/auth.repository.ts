import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpInputDto } from 'src/auth/dto/user-signUp.input.dto';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserSignInInputDto } from 'src/auth/dto/user-signIn.input.dto';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';

@Injectable()
export class AuthRepository extends Repository<User> {
  @InjectRepository(User)
  private readonly authRepository: Repository<User>;

  async findUserByEmail(email: string): Promise<User> {
    const foundUser = await this.authRepository.findOne({ email });
    return foundUser;
  }
  async findUserById(id: number): Promise<User> {
    const foundUser = await this.authRepository.findOne({ id });
    if (!foundUser) {
      throw new ConflictException('해당 유저를 찾을 수 없습니다.');
    }
    return foundUser;
  }

  async isUserExist(email: string): Promise<User> {
    const foundUser = await this.authRepository.findOne({ email });
    if (foundUser) {
      throw new ConflictException('해당 계정이 이미 존재합니다.');
    }
    return foundUser;
  }

  async signUp(userSignUpInputDto: UserSignUpInputDto): Promise<User> {
    const { email, name, password } = userSignUpInputDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.authRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    await this.authRepository.insert(user);
    return user;
  }

  async signIn(userSignInInputDto: UserSignInInputDto): Promise<UserInfoDto> {
    const { email, password } = userSignInInputDto;
    const user = await this.authRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호를 잘못 입력했습니다!',
      );
    }
  }

  async getUserList(): Promise<{ id: number }[]> {
    const userList = await this.authRepository.find({
      select: ['id'],
    });
    return userList;
  }

  async removeRefreshToken(id: number) {
    await this.authRepository.update(id, {
      currentHashedRefreshToken: null,
    });
  }
}
