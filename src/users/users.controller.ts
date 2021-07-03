import {
  Request,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Put,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './../dto/CreateUser.dto';
import { LoginUserDto } from './../dto/Loginuser.dto';
import { UpdateUserDto } from './../dto/UpdateUser.dto';
import { User } from './../entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // async findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findId(@Request() req): Promise<User> {
    return this.usersService.findOne(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeId(@Request() req): Promise<void> {
    return this.usersService.remove(req);
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<void> {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(updateData, req);
  }

  @Post('/login')
  async login(@Body() loginUserData: LoginUserDto): Promise<void> {
    return this.usersService.login(loginUserData);
  }
}
