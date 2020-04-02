import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsUrl, IsDate } from 'class-validator';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/camelcase
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  @IsNotEmpty()
  repository: string;

  @Column({ default: new Date() })
  @IsDate()
  createdAt: Date;
}
