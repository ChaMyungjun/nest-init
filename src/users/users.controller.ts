import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './../dto/CreateUser.dto';
import { LoginUserDto } from './../dto/Loginuser.dto';
import { UpdateUserDto } from './../dto/UpdateUser.dto';
import { User } from './../entities/user.entity';
import { UsersService } from './users.service';

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

  @Post('/login')
  async login(@Body() loginUserData: LoginUserDto): Promise<void> {
    return this.usersService.login(loginUserData);
  }
}
