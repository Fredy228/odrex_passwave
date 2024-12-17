import { HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'process';

import { CustomException } from '../custom-exception';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPass(event: { email: string; key: string }) {
    try {
      await this.mailerService.sendMail({
        from: process.env.SMTP_USER,
        to: event.email,
        subject: 'Restore password PassWave.',
        template: 'forgot-pass',
        context: {
          url: `${process.env.REACT_URL}/auth/forgot/${event.key}`,
        },
      });
    } catch (e) {
      console.error(e);
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        'Error sending restore password',
      );
    }
  }
}
