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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    console.log(id);
    return this.userRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async create(CreateUserDto: CreateUserDto): Promise<any> {
    const user = new User();
    user.name = CreateUserDto.name;
    user.email = CreateUserDto.email;
    user.password = CreateUserDto.password;

    console.log(user);

    const index = (await this.findAll()).find(
      (cur: any) => cur.name === user.name || cur.email === user.email,
    );

    if (index) {
      throw new BadRequestException();
    } else {
      return this.userRepository.save(user);
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
}
