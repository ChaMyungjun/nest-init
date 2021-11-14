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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './../dto/CreateUser.dto';
import { LoginUserDto } from './../dto/Loginuser.dto';
import { UpdateUserDto } from './../dto/UpdateUser.dto';
import { User } from './../entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저 전체를 조회한다.',
  })
  @ApiResponse({ description: '유저를 전체 조회한다.', type: User })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: '특정 유저 조회 API',
    description: '특정유저를 조회한다.',
  })
  @ApiResponse({ description: '특정유저를 조회한다.', type: User })
  async findId(@Request() req): Promise<User> {
    return this.usersService.findOne(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({
    summary: '유저 삭제 API',
    description: '유저 삭제한다.',
  })
  @ApiResponse({ description: '유저 삭제한다.', type: User })
  async removeId(@Request() req): Promise<void> {
    return this.usersService.remove(req);
  }

  @Post()
  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저 생성한다.',
  })
  @ApiResponse({ description: '유저 생성한다.', type: User })
  async create(@Body() user: CreateUserDto): Promise<void> {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiOperation({
    summary: '유저 수정 API',
    description: '유저 수정한다.',
  })
  @ApiResponse({ description: '유저 수정한다.', type: User })
  async update(@Request() req, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(updateData, req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({
    summary: '유저 로그인 API',
    description: '유저 로그인한다.',
  })
  @ApiResponse({ description: '유저 로그인한다.', type: User })
  async login(@Request() loginUserData: LoginUserDto): Promise<void> {
    console.log(loginUserData);
    // return this.usersService.login(loginUserData);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/login/social')
  @ApiOperation({
    summary: '유저 소셜 로그인 API',
    description: '유저 소셜 로그인한다.',
  })
  @ApiResponse({ description: '유저 소셜 로그인 후 정보 저장.', type: User })
  //https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=3040da9b120368bb91958c4d4eb5511e&redirect_uri=http://localhost:3000/user/kakao/auth&state=kakao
  async socialLogin(@Body() socialLoginData: { code: string }): Promise<any> {
    return this.usersService.socailLogin(socialLoginData.code);
  }

  //exmaple clusting testing
  @Get('/cluster')
  @ApiOperation({
    summary: 'testing api',
    description: 'exmaple clusting testing',
  })
  @ApiResponse({ description: 'testing api.', type: User })
  async cluster(): Promise<any> {
    return this.usersService.clusrterTesting();
  }
}
