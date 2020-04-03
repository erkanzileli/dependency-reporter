/* eslint-disable @typescript-eslint/camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

@Entity()
@Index(['email', 'repository'], { unique: true })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  repository: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
