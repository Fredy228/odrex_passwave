import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { Interval } from '@nestjs/schedule';
import { MoreThan } from 'typeorm';

import { CodeAccessRepository } from '../../repository/code-access.repository';

@Injectable()
export class AuthCronService {
  private readonly CLEAR_SEND_EMAIL_TIME: number;

  constructor(private readonly codeAccessRepository: CodeAccessRepository) {
    this.CLEAR_SEND_EMAIL_TIME =
      Number(process.env.CLEAR_SEND_EMAIL_TIME) || 7776000000;
  }

  @Interval(Number(process.env.CLEAR_TRY_LAST_TIME) || 7776000000)
  async clearOldCode() {
    const timeAgo = new Date(Date.now() - this.CLEAR_SEND_EMAIL_TIME);

    const [codes, total] = await this.codeAccessRepository.findAndCountBy({
      createAt: MoreThan(timeAgo),
    });
    if (total) await this.codeAccessRepository.delete(codes.map((i) => i.id));
  }
}
