import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config = require('config');
import { AuthRepository } from 'src/auth/auth.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      secretOrKey:
        process.env.JWT_SECRET || config.get('jwt.accessToken_secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload: { id: number }): Promise<any> {
    console.log('밑에');
    const { id } = payload;
    const user = await this.userService.findUserById(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
