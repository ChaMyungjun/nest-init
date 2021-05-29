import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './../dto/CreateUser.dto';
import { User } from './../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findId(@Param() userId: number): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Delete(':id')
  async removeId(@Param() userId: number): Promise<void> {
    return this.usersService.remove(userId);
  }
}
