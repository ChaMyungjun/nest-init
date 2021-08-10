import {
  Injectable,
  BadRequestException,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as qs from 'qs';
import axios from 'axios';
import * as cluster from 'cluster';
import os from 'os';

//entity
import { User } from '../entities/user.entity';

//userDto
import { CreateUserDto } from './../dto/CreateUser.dto';
import { UpdateUserDto } from './../dto/UpdateUser.dto';
import { LoginUserDto } from './../dto/Loginuser.dto';

//password hashing
import { createHashedPassword, makePasswordHashed } from './user.password.hash';

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

  async findOne(req: any): Promise<User> {
    return this.userRepository.findOne(req.user.id);
  }

  async remove(req: any): Promise<void> {
    await this.userRepository.delete(req.user.id);
  }

  async create(CreateUserDto: CreateUserDto): Promise<any> {
    const token = this.createToken();
    const HashedPassword: any = await createHashedPassword(
      CreateUserDto.password,
      CreateUserDto.passwordConfirm,
    );

    if (HashedPassword.error) {
      throw new BadRequestException(HashedPassword.error);
    }

    const user = new User();
    user.name = CreateUserDto.name;
    user.email = CreateUserDto.email;
    user.password = HashedPassword.password;
    user.salt = HashedPassword.salt;
    user.access_token = (await token).accessToken;
    user.refresh_token = (await token).refreshToken;

    const index = (await this.findAll()).find(
      (cur: any) => cur.name === user.name || cur.email === user.email,
    );

    if (index) {
      throw new BadRequestException();
    } else {
      this.userRepository.save(user);
      return {
        access: await (await token).accessToken,
        refresh: await (await token).refreshToken,
      };
    }

    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
  }

  async update(UpdateUserDto: UpdateUserDto, req: any): Promise<any> {
    const index = await this.findOne(req);
    if (!index) {
      throw new BadRequestException();
    } else {
      this.userRepository.update(req.user.id, UpdateUserDto);
      return UpdateUserDto;
    }
  }

  async login(userData: LoginUserDto): Promise<any> {
    const token = this.createToken();
    const index = (await this.findAll()).find(
      (cur) => cur.email === userData.email,
    );

    const password = await makePasswordHashed(index, userData.password);

    if (!index || index.password !== password) {
      throw new BadRequestException();
    } else {
      const updateToken: any = index;
      const access_token = (await token).accessToken;
      const refresh_token = (await token).refreshToken;
      updateToken.access_token = access_token;
      updateToken.refresh_token = refresh_token;
      this.userRepository.update(updateToken.id, updateToken);
      return {
        acces: updateToken.access_token,
        refresh: updateToken.refresh_token,
      };
    }
  }

  async socailLogin(code: string): Promise<any> {
    const state = code.split('&')[1].split('=')[1];

    console.log(state);

    const url = 'https://kauth.kakao.com/oauth/token';
    const data = {
      grant_type: 'authorization_code',
      client_id: '3040da9b120368bb91958c4d4eb5511e',
      redirect_uri: 'http://localhost:3000/user/kakao/auth',
      code: code.split('&')[0],
      client_secret: '34xuf4W6rvKJSIqOfNODkDvcfjWG0Lfh',
    };
    const axiosConfig = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };

    await axios
      .post(url, qs.stringify(data), axiosConfig)
      .then((res) => {
        console.log(res.data);
        if (state === 'kakao') {
          this.socialUserMe(state, res.data?.access_token);
        }
      })
      .catch((err) => console.log(err.response?.data));
  }

  async socialUserMe(state: string, token) {
    let user;
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (state === 'kakao') {
      try {
        user = axios.get('https://kauth.kakao.com/v2/user/me', axiosConfig);
      } catch (e) {
        console.log(e.data);
      }
    }
    console.log(await user);
  }

  async createToken() {
    const access_random = randomBytes(21).toString('base64').slice(0, 21);
    const refresh_random = randomBytes(21).toString('base64').slice(0, 21);
    const access: string = access_random;
    const refresh: string = refresh_random;

    const accessToken = this.jwtService.sign(
      { access: access },
      // { expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign({ refresh: refresh });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    if (username || pass) {
      // console.log(username, pass);
    }
    return { username, pass };
  }

  //cluster testing
  clusrterTesting() {
    //cpu num
    const numCPUs = os?.cpus()?.length;

    if (cluster.isMaster) {
      console.log(`마스터 프로세스 아이디: ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      //워커 종료
      cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료 되었습니다`);
        console.log('code', code, 'signal', signal);
      });
    } else {
      console.log('wow!!');
    }

    console.log(`${process.pid}번 워커 실행`);

    return process.pid;
  }
}
