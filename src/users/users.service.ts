/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
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

  //user all find
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  //spect user find
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  //spect user delete
  async remove(req: any): Promise<void> {
    await this.userRepository.delete(req.user.id);
  }

  //user create
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
  }

  //spect user update
  async update(UpdateUserDto: UpdateUserDto, req: any): Promise<any> {
    const index = await this.findOne(req.user.id);
    if (!index) {
      throw new BadRequestException();
    } else {
      this.userRepository.update(req.user.id, UpdateUserDto);
      return UpdateUserDto;
    }
  }

  //user login
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

  //social login kakao && naver
  async socailLogin(code: string): Promise<any> {
    const state = code.split('&')[1].split('=')[1];
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
        if (state === 'kakao') {
          try {
            this.socialUserMe(
              state,
              res, 
            );
          } catch (e) {
            throw new BadRequestException();
          }
        }
      })
      .catch((err) => {
        console.log('error', err.response?.data);
        throw new BadRequestException();
      });
  }

  //social login me request
  async socialUserMe(state: string, res: any) {
    // res.data?.access_token,
    // res.data?.refresh_token,
    if (state === 'kakao' && res.data?.access_totken) {
      // const user = await this.userRepository.findOne()
      await this.socialKakaoCreateUser(res.data?.access_token, res.data?.refresh_token)
    } else if (state === 'naver' && res.data?.access_token) {
      //naver login processing
    }
  }

  async socialKakaoCreateUser (token, refresh) {
    try {
      axios
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          const user = new User();
          /**
           * HashedPassword type
           *
           * {salt: string, password: string}
           *
           *
           * {error: string}
           *
           */
          const HashedPassword: any = await createHashedPassword(
            res.data.id.toString(),
            res.data.id.toString(),
          );
          
          user.name = res.data.kakao_account.profile.nickname;
          user.password = HashedPassword.password
          user.age = res.data.kakao_account.email;
          user.salt = HashedPassword.salt;
          user.access_token = token;
          user.refresh_token = refresh;

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
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.log('error', e.data);
    }
  }

  //access & refresh token generate
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

  //check user validate
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

  //for naver state
  radomStringGen(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
