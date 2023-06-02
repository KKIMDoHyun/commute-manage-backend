import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config = require('config');
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          if (!request?.cookies?.Refresh) {
            throw new UnauthorizedException('No Refresh Token');
          }
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: config.get('jwt').refreshToken_secret,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req, payload: any) {
    if (Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Expired Refresh Token');
    }
    const refreshToken = req.cookies?.Refresh;
    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
