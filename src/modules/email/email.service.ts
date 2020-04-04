import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendEmail(to: string, title: string, content: string) {
    console.log(to, title, content);
  }
}
