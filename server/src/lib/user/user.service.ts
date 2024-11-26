import { HttpStatus, Injectable } from '@nestjs/common';
import * as process from 'process';

import { User } from '../../entity/user.entity';
import { UserRepository } from '../../repository/user.repository';
import { CustomException } from '../../services/custom-exception';
import { hashPassword } from '../../services/hashPassword';
import { UserDto } from './dto/user.dto';
import { RoleEnum } from '../../enums/role.enum';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { FileService } from '../../services/file/file.service';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async onModuleInit() {
    if (!Number(process.env.ON_START_CREATE_ADMIN)) return;

    this.create({
      email: process.env.DEFAUL_ADMIN_EMAIL,
      password: process.env.DEFAUL_ADMIN_PASSWORD,
      name: process.env.DEFAUL_ADMIN_NAME,
      role: RoleEnum.ADMIN,
    }).catch(console.error);
  }

  async create(body: UserDto): Promise<User> {
    const userFound = await this.userRepository.findOneBy({
      email: body.email,
    });
    if (userFound)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `User with email "${body.email}" already exists`,
      );

    const hashPass = await hashPassword(body.password);

    const newUser = this.userRepository.create({
      ...body,
      password: hashPass,
    });
    const savedUser = await this.userRepository.save(newUser);

    if (body.avatar) {
      // const clearSvg = filterXss(body.avatar);
      savedUser.avatarUrl = await this.fileService.saveSvgToFile(
        body.avatar,
        'public',
        `${savedUser.id}`,
      );
      await this.userRepository.save(savedUser);
    }

    return { ...savedUser, password: undefined };
  }

  async getAll(query: QuerySearchDto) {
    return this.userRepository.getAllUsers(query);
  }

  async getById(id: number) {
    return this.userRepository.getById(id);
  }

  async update(user_req: User, userId: number, body: UserUpdateDto) {
    const user = await this.userRepository.getById(userId);

    if (user_req.id !== user.id && user_req.role !== RoleEnum.ADMIN)
      throw new CustomException(
        HttpStatus.FORBIDDEN,
        `You don't have privileges to update other users`,
      );

    if (body.role && user_req.role !== RoleEnum.ADMIN) body.role = undefined;

    if (body.phone) {
      try {
        const parseNumber = parsePhoneNumberWithError(
          body.phone.number,
          body.phone.country,
        );
        if (!parseNumber.isValid()) new Error(`Invalid phone number`);
      } catch {
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `The number phone is invalid`,
        );
      }
    }

    await this.userRepository.update(user.id, {
      name: body.name,
      role: body.role,
      email: body.email,
      phone: body.phone,
    });

    return { ...user, ...body, password: undefined };
  }

  async delete(user_req: User, userId: number) {
    const user = await this.userRepository.getById(userId);

    if (user_req.id !== user.id && user_req.role !== RoleEnum.ADMIN)
      throw new CustomException(
        HttpStatus.FORBIDDEN,
        `You don't have privileges to delete other users`,
      );

    if (user.role === RoleEnum.ADMIN) {
      const admins = await this.userRepository.findAndCount({
        where: {
          role: RoleEnum.ADMIN,
        },
      });
      if (admins[1] < 2)
        throw new CustomException(
          HttpStatus.NOT_FOUND,
          `You cannot delete the last admin. You need to add another admin.`,
        );
    }

    await this.userRepository.delete(user.id);

    user.password = undefined;

    return user;
  }
}
