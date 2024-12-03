import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as process from 'process';
import { MoreThan } from 'typeorm';

import { TryLoginRepository } from '../../repository/try-login.repository';

@Injectable()
export class TryLoginCronService {
  private readonly CLEAR_TRY_LAST_TIME: number;

  constructor(private readonly tryLoginRepository: TryLoginRepository) {
    this.CLEAR_TRY_LAST_TIME =
      Number(process.env.CLEAR_TRY_LAST_TIME) || 7776000000;
  }

  @Interval(Number(process.env.CLEAR_TRY_LAST_TIME) || 7776000000)
  async clearOldTryLogin() {
    const timeAgo = new Date(Date.now() - this.CLEAR_TRY_LAST_TIME);

    const [history, total] = await this.tryLoginRepository.findAndCountBy({
      createAt: MoreThan(timeAgo),
    });
    if (total) await this.tryLoginRepository.delete(history.map((i) => i.id));
  }
}
