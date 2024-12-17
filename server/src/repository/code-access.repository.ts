import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';
import * as process from 'process';

import { CustomException } from '../services/custom-exception';
import { CodeAccess } from '../entity/code-access.entity';

@Injectable()
export class CodeAccessRepository extends Repository<CodeAccess> {
  private readonly COUNT_SEND_EMAIL: number;
  private readonly DURING_TIME_CHECK_SEND: number;
  // private readonly CLEAR_SEND_EMAIL_TIME: number;
  private readonly DURING_TIME_VALID_SMS_CODE: number;

  constructor(private dataSource: DataSource) {
    super(CodeAccess, dataSource.createEntityManager());

    this.COUNT_SEND_EMAIL = Number(process.env.COUNT_SEND_EMAIL) || 5;
    this.DURING_TIME_CHECK_SEND =
      Number(process.env.DURING_TIME_CHECK_SEND) || 3600000;
    this.DURING_TIME_VALID_SMS_CODE =
      Number(process.env.DURING_TIME_VALID_SMS_CODE) || 900000;
  }

  async checkBlock(params: { ipAddress: string; email: string }) {
    const { ipAddress, email } = params;

    const timeAgo = new Date(Date.now() - this.DURING_TIME_CHECK_SEND);

    const [_, total] = await this.findAndCountBy([
      {
        ipAddress,
        createAt: MoreThan(timeAgo),
      },
      {
        email,
        createAt: MoreThan(timeAgo),
      },
    ]);
    if (total >= this.COUNT_SEND_EMAIL)
      throw new CustomException(
        HttpStatus.TOO_MANY_REQUESTS,
        `You have exhausted all attempts to send email. The next attempt will be available later`,
      );
  }

  async checkCode(params: { code: string }) {
    const { code } = params;

    const timeAgo = new Date(Date.now() - this.DURING_TIME_VALID_SMS_CODE);

    const codeAccess = await this.findOneBy({
      code,
      createAt: MoreThan(timeAgo),
    });

    if (!codeAccess)
      throw new CustomException(
        HttpStatus.NOT_ACCEPTABLE,
        `The code is not valid`,
      );

    return codeAccess;
  }
}
