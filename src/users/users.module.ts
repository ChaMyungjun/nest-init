import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
// import { UserProviders } from './user.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigService,
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
    }),
    // PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, LocalStrategy],
  exports: [UsersService],
})
export class UsersModule {}
