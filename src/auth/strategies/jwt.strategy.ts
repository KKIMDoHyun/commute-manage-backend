import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config = require('config');
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
        process.env.JWT_SECRET || config.get('jwt').accessToken_secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload): Promise<any> {
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
