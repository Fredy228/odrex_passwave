import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { PasswordRepository } from '../../repository/password.repository';
import { PasswordCreateDto } from './dto/password.create.dto';
import { DeviceRepository } from '../../repository/device.repository';
import { CryptoDataService } from '../../services/crypto-data/crypto-data.service';
import { FileService } from '../../services/file/file.service';
import { Password } from '../../entity/password.entity';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { User } from '../../entity/user.entity';
import { Privilege } from '../../entity/privilege.entity';
import { RoleEnum } from '../../enums/role.enum';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { PasswordUpdateDto } from './dto/password.update.dto';
import { join } from 'path';
import { CustomException } from '../../services/custom-exception';
import { Permit } from '../../enums/permit.enum';

@Injectable()
export class PasswordService {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly cryptoDataService: CryptoDataService,
    private readonly fileService: FileService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    deviceId: number,
    body: PasswordCreateDto,
    files: Array<Express.Multer.File>,
  ): Promise<Password> {
    const device = await this.deviceRepository.getById(deviceId);

    const modifyData = body;

    if (modifyData.password)
      modifyData.password = this.cryptoDataService.encryptionData(
        modifyData.password,
      );

    const newPassword = this.passwordRepository.create({
      ...body,
      device,
    });

    const saverPass = await this.passwordRepository.save(newPassword);

    if (files.length) {
      const paths = await this.fileService.saveFileMany(
        files,
        'static',
        'passwords',
        `${saverPass.id}`,
      );
      await this.passwordRepository.update(saverPass.id, {
        files: paths,
      });
    }

    return newPassword;
  }

  async getById(passId: number): Promise<Password> {
    const res = await this.passwordRepository.getById(passId);
    if (res.password)
      res.password = this.cryptoDataService.decryptionData(res.password);
    return res;
  }

  async getAll(
    deviceId: number,
    user: User,
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
  ) {
    const privileges: Privilege[] | false =
      Boolean(user.role !== RoleEnum.ADMIN) &&
      (await this.privilegeRepository.find({
        where: {
          group: {
            user,
          },
        },
      }));
    if (privileges?.length === 0) return [];

    const res = await this.passwordRepository.getByPrivilege(
      { sort, filter, range },
      deviceId,
      privileges || undefined,
    );

    res.data = res.data.map((i) => {
      if (i.password)
        i.password = this.cryptoDataService.decryptionData(i.password);
      return i;
    });

    return res;
  }

  async update(
    user: User,
    passId: number,
    body: Partial<PasswordUpdateDto>,
    files: Array<Express.Multer.File>,
  ): Promise<Password> {
    const modifyData: Record<string, any> = body;

    const pass = await this.passwordRepository.getById(passId);
    await this.privilegeRepository.checkIsEditPass(user, pass.id);

    if (!Object.keys(modifyData).length && !files.length) return pass;

    if (modifyData.password)
      modifyData.password = this.cryptoDataService.encryptionData(
        modifyData.password,
      );

    if (files.length) {
      const paths = await this.fileService.saveFileMany(
        files,
        'static',
        'passwords',
        `${pass.id}`,
      );

      modifyData['files'] = [...paths];
      if (pass.files) modifyData.files.push(...pass.files);
    }

    await this.passwordRepository.update(pass.id, modifyData);

    return Object.assign(pass, body);
  }

  async delete(passId: number): Promise<Password> {
    const password = await this.passwordRepository.getById(passId);

    return this.entityManager.transaction(async (manager) => {
      await manager.delete(Password, password.id);
      await this.fileService.deleteFolders([
        join('static', 'passwords', `${password.id}`),
      ]);

      return password;
    });
  }

  async deleteFile(user: User, passId: number, fileKey: string): Promise<void> {
    const password = await this.passwordRepository.getById(passId);
    await this.privilegeRepository.checkIsEditPass(user, password.id);

    const fileObj = password?.files?.find((i) => i.file_key === fileKey);
    if (!fileObj)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `File not found by key`,
      );

    return this.entityManager.transaction(async (manager) => {
      await manager.update(Password, password.id, {
        files: password.files.filter((i) => i.file_key !== fileKey),
      });
      await this.fileService.deleteFiles([fileObj.file_path]);
      return;
    });
  }
}
