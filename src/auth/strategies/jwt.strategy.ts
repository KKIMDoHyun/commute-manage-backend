import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config = require('config');
import { AuthRepository } from 'src/auth/auth.repository';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey:
        process.env.JWT_SECRET || config.get('jwt.accessToken_secret'),
      ignoreExpiration: false,
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     return request?.cookies?.Authentication;
      //   },
      // ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload): Promise<any> {
    console.log('페이로드', payload);
    const user = await this.userRepository.findOne(payload.id);
    if (user) {
      return user;
    }
    throw new HttpException(
      '해당 유저가 존재하지 않습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
}
