import { UpdateUserDto } from './../dto/UpdateUser.dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Put,
} from '@nestjs/common';
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
    console.log(userId);
    return this.usersService.findOne(userId);
  }

  @Delete(':id')
  async removeId(@Param() userId: number): Promise<void> {
    return this.usersService.remove(userId);
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<void> {
    return this.usersService.create(user);
  }

  @Put(':id')
  async update(@Param('id') userId: number, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(userId, updateData);
  }
}
