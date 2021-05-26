import { Module } from '@nestjs/common';
import { DatabaseModule } from './../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
})
export class UsersModule {}
