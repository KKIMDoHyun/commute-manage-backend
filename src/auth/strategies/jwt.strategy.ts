import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config = require('config');
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      secretOrKey:
        process.env.JWT_SECRET || config.get('jwt.accessToken_secret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }
  async validate(payload) {
    const { email } = payload;
    const user = await this.authRepository.isUserExist(email);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
