import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import * as process from 'process';

import { TryLogin } from '../entity/try-login.entity';
import { CustomException } from '../services/custom-exception';

@Injectable()
export class TryLoginRepository extends Repository<TryLogin> {
  private readonly COUNT_TRY_LOGIN_DEFAULT: number;
  private readonly COUNT_TRY_LOGIN_TRUE_EMAIL: number;
  private readonly DURING_TIME_CHECK_TRY: number;

  constructor(private dataSource: DataSource) {
    super(TryLogin, dataSource.createEntityManager());

    this.COUNT_TRY_LOGIN_DEFAULT =
      Number(process.env.COUNT_TRY_LOGIN_DEFAULT) || 5;
    this.COUNT_TRY_LOGIN_TRUE_EMAIL =
      Number(process.env.COUNT_TRY_LOGIN_TRUE_EMAIL) || 5;
    this.DURING_TIME_CHECK_TRY =
      Number(process.env.DURING_TIME_CHECK_TRY) || 3600000;
  }

  async checkBlock(params: Pick<TryLogin, 'ipAddress' | 'isEmailTrue'>) {
    const { isEmailTrue, ipAddress } = params;

    const timeAgo = new Date(Date.now() - this.DURING_TIME_CHECK_TRY);

    const [_, total] = await this.findAndCountBy({
      isEmailTrue,
      ipAddress,
      createAt: MoreThan(timeAgo),
    });
    if (
      total >=
      (isEmailTrue
        ? this.COUNT_TRY_LOGIN_TRUE_EMAIL
        : this.COUNT_TRY_LOGIN_DEFAULT)
    )
      throw new CustomException(
        HttpStatus.TOO_MANY_REQUESTS,
        `You have exhausted all attempts to log in. The next attempt will be available later`,
      );
  }

  async createAndSave(params: Omit<TryLogin, 'id' | 'createAt'>) {
    const { isEmailTrue, ipAddress, email, deviceModel } = params;

    const newTry = this.create({
      ipAddress,
      email,
      deviceModel,
      isEmailTrue,
    });
    await this.save(newTry);
  }

  async deleteWhere(where: FindOptionsWhere<TryLogin>) {
    const history = await this.findBy({
      ...where,
    });

    if (history.length) await this.delete(history.map((i) => i.id));
  }
}
