import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';
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
  // eslint-disable-next-line @typescript-eslint/camelcase
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  @IsNotEmpty()
  repository: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
