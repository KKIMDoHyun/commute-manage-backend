import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserInfoDto } from 'src/auth/dto/user-info.dto';
import { UserSignInInputDto } from 'src/auth/dto/user-signIn.input.dto';
import { UserSignUpInputDto } from 'src/auth/dto/user-signUp.input.dto';
import config = require('config');
import { UserSignInOutputDto } from 'src/auth/dto/user-signIn.output.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    userSignUpInputDto: UserSignUpInputDto,
  ): Promise<UserSignUpInputDto> {
    return this.authRepository.signUp(userSignUpInputDto);
  }

  async signIn(
    userSignInInputDto: UserSignInInputDto,
  ): Promise<UserSignInOutputDto> {
    try {
      const user = await this.authRepository.signIn(userSignInInputDto);
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
