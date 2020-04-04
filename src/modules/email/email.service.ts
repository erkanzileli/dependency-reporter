import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Mail;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const from = `Dependency Reporter <${this.configService.get<string>(
      'email.user',
    )}>`;
    await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    this.logger.log(`Message sent to ${to}. 
    Text: ${text}
    HTML: ${html}`);
  }
}
