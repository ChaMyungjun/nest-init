import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
// import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async validate(payload: any, done: Function) {
    // const user = await this.usersService.validateUser(payload);
    // if (!user) {
    //   return done(new UnauthorizedException(), false);
    // }
    if (payload) {
      return payload;
    }
    done(null, payload);
  }
}
