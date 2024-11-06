import { HttpStatus, Injectable } from '@nestjs/common';

import { User } from '../../entity/user.entity';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { Privilege } from '../../entity/privilege.entity';
import { RoleEnum } from '../../enums/role.enum';
import { CustomException } from '../../services/custom-exception';
import { pathExistsSync, lstatSync } from 'fs-extra';
import { join } from 'path';
import * as process from 'process';

import { PasswordRepository } from '../../repository/password.repository';
import { FileType } from '../../types/file.type';

@Injectable()
export class StaticService {
  constructor(
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly passwordRepository: PasswordRepository,
  ) {}

  async getPassFile(
    user: Pick<User, 'id' | 'email' | 'role'>,
    path: string,
  ): Promise<[string, FileType]> {
    const passId = Number(path.split('/')[0]);
    if (!passId)
      throw new CustomException(HttpStatus.BAD_REQUEST, `Wrong link`);

    const isAdmin: boolean = Boolean(user.role === RoleEnum.ADMIN);

    const password = await this.passwordRepository.findOne({
      where: {
        id: passId,
        privileges: isAdmin
          ? undefined
          : {
              group: {
                user: {
                  id: user.id,
                },
              },
            },
      },
      select: {
        id: true,
        name: true,
        files: true,
      },
    });
    if (!password)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Password includes this file not found`,
      );
    const fileObj = password.files.find((i) => i.file_path.includes(path));
    if (!fileObj)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `File not found in password of file list`,
      );

    const filePath = join(process.cwd(), 'static', 'passwords', path);
    if (!pathExistsSync(filePath) || lstatSync(filePath).isDirectory())
      throw new CustomException(HttpStatus.NOT_FOUND, `File not found`);

    return [filePath, fileObj];
  }
}
