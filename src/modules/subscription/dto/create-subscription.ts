import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // eslint-disable-next-line @typescript-eslint/camelcase
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  @IsNotEmpty()
  repository: string;
}
