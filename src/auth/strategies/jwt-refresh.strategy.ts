import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config = require('config');
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: config.get('jwt.refreshToken_secret'),
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Refresh;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.Refresh;
    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
