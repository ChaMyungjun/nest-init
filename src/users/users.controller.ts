import {
  Request,
  Controller,
  UseGuards,
  Delete,
  Get,
  Post,
  Body,
  Put,
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

  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

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

  @Post('/login/social')
  //https://kauth.kakao.com/oauth/authorize?client_id=3040da9b120368bb91958c4d4eb5511e&redirect_uri=http://localhost:3000/user/kakao/auth&response_type=code
  // http://localhost:3000/user/kakao/auth?code=FbLl2RC97GiQ5eZqmzeE2hqs_1HoFIEEahF8WF95hw-vHtfzlufaddYcBpF3VjHnPwDBJgorDKYAAAF6kSos7g
  // https://zionh.tistory.com/40
  async socialLogin(@Body() socialLoginData: { code: string }): Promise<any> {
    return this.usersService.socailLogin(socialLoginData.code);
    // console.log(socialLoginData);
  }
}
