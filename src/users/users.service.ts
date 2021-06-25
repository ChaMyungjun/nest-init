import {
  Injectable,
  BadRequestException,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/CreateUser.dto';
import { UpdateUserDto } from './../dto/UpdateUser.dto';
import { LoginUserDto } from './../dto/Loginuser.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
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
    const token = this.createToken();

    const user = new User();
    user.name = CreateUserDto.name;
    user.email = CreateUserDto.email;
    user.password = CreateUserDto.password;
    user.access_token = (await token).accessToken;
    user.refresh_token = (await token).refreshToken;

    const index = (await this.findAll()).find(
      (cur: any) => cur.name === user.name || cur.email === user.email,
    );

    if (index) {
      throw new BadRequestException();
    } else {
      this.userRepository.save(user);
      return {};
      // return { access: access_token, refresh: refresh_token };
    }

    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
  }

  async update(UpdateUserDto: UpdateUserDto): Promise<any> {
    console.log(UpdateUserDto);
    // const index = await this.findOne(id);
    // console.log(index);
    // if (!index) {
    //   throw new BadRequestException();
    // } else {
    //   return this.userRepository.update(id, UpdateUserDto);
    // }
  }

  async login(userData: LoginUserDto): Promise<any> {
    const token = this.createToken();

    const index = (await this.findAll()).find(
      (cur) =>
        cur.email === userData.email && cur.password === userData.password,
    );
    if (!index) {
      throw new BadRequestException();
    } else {
      const updateToken = index;
      const access_token = (await token).accessToken;
      const refresh_token = (await token).refreshToken;
      updateToken.access_token = access_token;
      updateToken.refresh_token = refresh_token;
      this.userRepository.update(Number(index.id), updateToken);
      return { access: access_token, refresh_token: refresh_token };
    }
  }

  async createToken() {
    const access_random = randomBytes(21).toString('base64').slice(0, 21);
    const refresh_random = randomBytes(21).toString('base64').slice(0, 21);
    const access: string = access_random;
    const refresh: string = refresh_random;

    const accessToken = this.jwtService.sign({ access: access });
    const refreshToken = this.jwtService.sign({ refresh: refresh });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    if (username || pass) {
      console.log(username, pass);
    }
    // console.log(username, pass);
    // const user = await this.findOne();
    // console.log('use', user);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return { username, pass };
  }
}
