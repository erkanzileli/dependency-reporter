/* eslint-disable @typescript-eslint/camelcase */
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(
    /https:\/\/github.com\/[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}\/[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}/,
    {
      message: 'repository must be a valid github repository',
    },
  )
  @IsNotEmpty()
  repository: string;
}
