import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          if (!request?.headers?.authorization) {
            throw new UnauthorizedException('No Access Token');
          }
          return request?.headers?.authorization.trim().replace('Bearer ', '');
        },
      ]),
    });
  }

  async validate(payload): Promise<any> {
    if (Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Expired Access Token');
    }
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
