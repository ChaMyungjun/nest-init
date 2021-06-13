import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: ObjectId;
  @Column()
  @IsString()
  name: string;
  @Column()
  @IsNumber()
  age: number;
  @Column()
  @IsString()
  email: string;
  @Column()
  @IsString()
  password: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;
}
