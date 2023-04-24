import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserSignInInputDto } from 'src/auth/dto/user-signIn.input.dto';
import { UserSignUpInputDto } from 'src/auth/dto/user-signUp.input.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/auth/entity/user.entity';
import config = require('config');
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    userSignUpInputDto: UserSignUpInputDto,
  ): Promise<UserSignUpInputDto> {
    try {
      await this.authRepository.isUserExist(userSignUpInputDto.email);
      return await this.authRepository.signUp(userSignUpInputDto);
    } catch (err) {
      throw new BadRequestException(err.response, {
        cause: new Error(),
        description: err.response,
      });
    }
  }

  /**
   * [로그인 시]
   * 유저가 DB에 있는지 인증 단계
   */
  async validateUser(userSignInInputDto: UserSignInInputDto): Promise<any> {
    const { email, password } = userSignInInputDto;
    const user = await this.authRepository.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new ForbiddenException('아이디 또는 비밀번호를 잘못 입력했습니다!');
    }
  }

  /**
   * [로그인 시]
   * AccessToken 발급 후 쿠키 정보와 함께 반환
   */
  async getCookieWithJwtAccessToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: config.get('jwt').accessToken_secret,
      expiresIn: config.get('jwt').accessToken_expiresIn,
    });
    return { accessToken: token };
  }

  /**
   * [로그인 시]
   * refreshToken 발급 후 쿠키 정보와 함께 반환
   */
  async getCookieWithJwtRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: config.get('jwt').refreshToken_secret,
      expiresIn: config.get('jwt').refreshToken_expiresIn,
    });
    return {
      refreshToken: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    };
  }

  /**
   * [로그인 시]
   * 발급받은 refreshToken을 암호화하여 DB에 저장
   */
  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(id, {
      currentHashedRefreshToken,
    });
  }

  /**
   * [Access Token 재발급 시]
   * 유저의 id를 이용하여 유저를 조회하고 refreshToken이 유효한지 확인
   */
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: number,
  ): Promise<User | { user: User; auth: boolean }> {
    const user = await this.authRepository.findUserById(id);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
    return;
  }

  /**
   * [로그아웃 시]
   * 토큰 만료시간 없앰
   */
  getCookiesForLogOut() {
    return {
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  async removeRefreshToken(id: number): Promise<void> {
    return await this.authRepository.removeRefreshToken(id);
  }
}
