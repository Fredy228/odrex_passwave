import { Module } from '@nestjs/common';
import * as process from 'process';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
// import * as dotenv from 'dotenv';

// dotenv.config();

import { MailService } from './mail.service';

console.log('SMTP_DOMAIN', process.env.SMTP_DOMAIN);
console.log('SMTP_PORT', process.env.SMTP_PORT);
console.log('SMTP_USER', process.env.SMTP_USER);
console.log('SMTP_PASS', process.env.SMTP_PASS);

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_DOMAIN,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      template: {
        dir: process.cwd() + '/src/templates-mail/',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
