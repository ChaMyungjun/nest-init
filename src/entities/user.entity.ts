import { Column } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

export class User {
  @Column()
  @IsString()
  readonly name: string;
  @Column()
  @IsNumber()
  readonly age: number;
  @Column()
  @IsString()
  readonly breed: string;
}
