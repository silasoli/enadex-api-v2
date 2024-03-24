import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IValidate, IValidateReturn } from '../interfaces/IValidate.interface';

@Injectable()
export class AuthUserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('USER_SECRET'),
    });
  }

  public async validate(payload: IValidate): Promise<IValidateReturn> {
    return { _id: payload.sub };
  }
}
