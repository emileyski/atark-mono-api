import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/core/interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'some_jwt_secret', //TODO: refactor to ENV
      ignoreExpiration: false,
    });

    console.log('jwt from request', ExtractJwt.fromAuthHeaderAsBearerToken());
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
