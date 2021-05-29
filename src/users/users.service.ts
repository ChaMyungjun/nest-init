import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // async create(CreateUserDto: CreateUserDto): Promise<User> {
  //   (await this.userRepository.find().exec()).map((cur: any) => {
  //     if (
  //       cur.name === CreateUserDto.name ||
  //       cur.email === CreateUserDto.email
  //     ) {
  //       throw new BadRequestException('Already Exists Member');
  //     }
  //   });
  //   return createdUser.save();
  // }
}
