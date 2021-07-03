import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: number;
  @Column({ unique: true })
  @IsString()
  name: string;
  @Column()
  @IsNumber()
  age: number;
  @Column({ unique: true })
  @IsString()
  email: string;
  @Column()
  @IsString()
  password: string;
  @Column()
  @IsString()
  salt: string | unknown;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;
}
