import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
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
