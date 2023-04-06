import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { UserSignInDto } from 'src/auth/dto/user-signIn.dto';
import { UserSignUpDto } from 'src/auth/dto/user-signUp.dto';
import config = require('config');

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserSignUpDto> {
    return this.authRepository.signUp(userSignUpDto);
  }

  async signIn(userSignInDto: UserSignInDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.authRepository.signIn(userSignInDto);
      const payload = {
        email: user.email,
        name: user.name,
      };
      const token = this.jwtService.sign(payload, {
        secret: config.get('jwt.accessToken_secret'),
        expiresIn: config.get('jwt').accessToken_expiresIn,
      });
      return {
        accessToken: token,
      };
    } catch (err) {
      throw new BadRequestException(err.response, {
        cause: new Error(),
        description: err.response,
      });
    }
  }
}
