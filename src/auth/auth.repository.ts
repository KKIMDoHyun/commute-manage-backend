import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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

  async findUser(email: string): Promise<boolean> {
    const foundUser = await this.authRepository.findOne({ email });
    return foundUser ? true : false;
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

  // async getJwtAccessToken(id: number): Promise<{ accessToken: string }> {
  //   const payload = { id };
  //   const token = this.jwtService.sign(payload, {
  //     secret: config.get('jwt.accessToken_secret'),
  //     expiresIn: config.get('jwt').accessToken_expiresIn,
  //   });
  //   return {
  //     accessToken: token,
  //   };
  // }
}
