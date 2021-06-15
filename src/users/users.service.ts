import {
  Injectable,
  BadRequestException,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/CreateUser.dto';
import { UpdateUserDto } from './../dto/UpdateUser.dto';
import { LoginUserDto } from './../dto/Loginuser.dto';
import { generateToken, generateRefresh } from './jwtFunc';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async create(CreateUserDto: CreateUserDto): Promise<any> {
    const access_token = generateToken(this.config.get('TOKEN_SECRET'));
    const refresh_token = generateRefresh(this.config.get('TOKEN_SECRET'));

    const user = new User();
    user.name = CreateUserDto.name;
    user.email = CreateUserDto.email;
    user.password = CreateUserDto.password;
    user.access_token = access_token;
    user.refresh_token = access_token;

    const index = (await this.findAll()).find(
      (cur: any) => cur.name === user.name || cur.email === user.email,
    );

    if (index) {
      throw new BadRequestException();
    } else {
      this.userRepository.save(user);
      return { access: access_token, refresh: refresh_token };
    }

    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
  }

  async update(id: number, UpdateUserDto: UpdateUserDto): Promise<any> {
    const index = await this.findOne(id);
    console.log(index);
    if (!index) {
      throw new BadRequestException();
    } else {
      return this.userRepository.update(id, UpdateUserDto);
    }
  }

  async login(userData: LoginUserDto): Promise<any> {
    const index = (await this.findAll()).find(
      (cur) =>
        cur.email === userData.email && cur.password === userData.password,
    );
    if (!index) {
      throw new BadRequestException();
    } else {
      const updateToken = index;
      const access_token = generateToken(this.config.get('TOKEN_SECRET'));
      const refresh_token = generateRefresh(this.config.get('TOKEN_SECRET'));
      updateToken.access_token = access_token;
      updateToken.refresh_token = refresh_token;
      this.userRepository.update(Number(index.id), updateToken);
      return { access: access_token, refresh_token: refresh_token };
    }
  }
}
