import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Details } from 'express-useragent';
import * as process from 'process';

import { CustomException } from '../../services/custom-exception';
import { checkPassword, hashPassword } from '../../services/hashPassword';
import { UserRepository } from '../../repository/user.repository';
import { UserDevicesRepository } from '../../repository/user-devices.repository';
import { TokenType } from '../../types/token.type';
import { User } from '../../entity/user.entity';
import { UserDevices } from '../../entity/user-devices.entity';
import { LoginAuthDto } from './dto/login.dto';
import { PassUpdateDto } from './dto/pass-update.dto';
import { TryLoginRepository } from '../../repository/try-login.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UserRepository,
    private devicesRepository: UserDevicesRepository,
    private tryLoginRepository: TryLoginRepository,
    private jwtService: JwtService,
  ) {}

  async signInCredentials(
    { email, password, userAgent }: LoginAuthDto & { userAgent: Details },
    ip: string,
  ): Promise<User & TokenType> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        devices: true,
      },
    });

    await this.tryLoginRepository.checkBlock({
      ipAddress: ip,
      isEmailTrue: Boolean(user),
    });

    const deviceModel = `${userAgent.platform} ${userAgent.os} ${userAgent.browser}`;

    if (!user) {
      await this.tryLoginRepository.createAndSave({
        email,
        isEmailTrue: false,
        deviceModel,
        ipAddress: ip,
      });
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Username or password is wrong`,
      );
    }

    const isValidPass = await checkPassword(password, user.password);

    if (!isValidPass) {
      await this.tryLoginRepository.createAndSave({
        email,
        isEmailTrue: true,
        deviceModel,
        ipAddress: ip,
      });
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Username or password is wrong`,
      );
    }

    const [tokens] = await Promise.all([
      this.addDeviceAuth(deviceModel, user, ip),
      this.deleteOldSession(user.devices),
      this.tryLoginRepository.deleteWhere({
        ipAddress: ip,
      }),
    ]);

    return { ...user, ...tokens, password: null };
  }

  async refreshToken(
    user: User,
    currentDevice: UserDevices,
    userAgent: Details,
  ): Promise<TokenType> {
    const deviceModel = `${userAgent?.platform} ${userAgent?.os} ${userAgent?.browser}`;

    if (deviceModel !== currentDevice.deviceModel)
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Login from an untrusted device`,
      );

    const newTokens = this.createToken(user);
    await this.devicesRepository.update(currentDevice.id, {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });

    return newTokens;
  }

  async logout(currentDevice: UserDevices): Promise<void> {
    await this.devicesRepository.delete(currentDevice.id);
    return;
  }

  async changePassword(
    user: User,
    currentDevice: UserDevices,
    { currentPass, newPass }: PassUpdateDto,
  ): Promise<void> {
    const userWithPass = await this.usersRepository.findOne({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const isValidPass = checkPassword(currentPass, userWithPass.password);
    if (!isValidPass) {
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        `Old password is wrong`,
      );
    }

    await this.usersRepository.update(userWithPass.id, {
      password: await hashPassword(newPass),
    });
    const session = await this.devicesRepository.findBy({
      user: {
        id: user.id,
      },
    });
    await this.devicesRepository.delete(
      session.filter((i) => i.id !== currentDevice.id).map((i) => i.id),
    );
  }

  async deleteOldSession(devices: UserDevices[]) {
    return Promise.all(
      devices.map(async (device) => {
        const decodedToken = await this.jwtService.decode(device.refreshToken);

        const currExp = decodedToken.exp * 1000;
        const currTime = new Date().getTime();

        if (currExp > currTime) return null;

        return await this.devicesRepository.delete(device);
      }),
    );
  }

  async addDeviceAuth(
    deviceModel: string,
    user: User,
    ip: string,
  ): Promise<TokenType> {
    const tokens = this.createToken(user);
    const newDevice = this.devicesRepository.create({
      deviceModel: deviceModel ? deviceModel : null,
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      ipAddress: ip,
    });

    await this.devicesRepository.save(newDevice);

    return tokens;
  }

  createToken(user: User): TokenType {
    const payload = { email: user.email, id: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRE_ACCESS_TOKEN,
    });
    const refreshToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }
}
