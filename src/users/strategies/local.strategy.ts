import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(username, password)
    const user = await this.usersService.validateUser(username, password);
    console.log('user', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
