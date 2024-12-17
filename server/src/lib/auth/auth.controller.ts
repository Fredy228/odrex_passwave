import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Joi from 'joi';
import { JoiPipe } from 'nestjs-joi';
import { ApiOperation, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import * as process from 'process';

import { AuthService } from './auth.service';
import { User } from '../../entity/user.entity';
import { UserDevices } from '../../entity/user-devices.entity';
import { LoginAuthDto } from './dto/login.dto';
import { TokenDto } from './dto/tokent.dto';
import { PassUpdateDto } from './dto/pass-update.dto';
import { PassRestoreDto } from './dto/pass-restore.dto';
import { EmailDto } from './dto/email.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User authorized',
    type: OmitType(User, ['password', 'devices']),
  })
  @ApiResponse({ status: 401, description: 'Username or password is wrong' })
  @HttpCode(200)
  async login(
    @Req()
    req: Request,
    @Body(JoiPipe) loginBody: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip: string = String(
      req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'unknown',
    );
    const userAgent = req['useragent'];
    const foundUser = await this.authService.signInCredentials(
      {
        ...loginBody,
        userAgent,
      },
      ip,
    );
    res.cookie('refreshToken', foundUser.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKI_EXPIRE),
    });
    return foundUser;
  }

  @Get('/refresh')
  @ApiOperation({ summary: 'Refresh tokens', description: 'Return tokens' })
  @ApiResponse({
    status: 200,
    description: 'User refreshed token',
    type: TokenDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid token or not found' })
  @HttpCode(200)
  async refreshToken(
    @Req()
    req: Request & {
      user: User;
      currentDevice: UserDevices;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req['useragent'];

    const tokens = await this.authService.refreshToken(
      req.user,
      req.currentDevice,
      userAgent,
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKI_EXPIRE),
    });
    return tokens;
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout user', description: 'Return null' })
  @ApiResponse({ status: 204, description: 'User logout' })
  @ApiResponse({ status: 401, description: 'Invalid token or not found' })
  @HttpCode(204)
  async logOut(
    @Req() req: Request & { user: User; currentDevice: UserDevices },
  ) {
    return this.authService.logout(req.currentDevice);
  }

  @Patch('/change-pass')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Changed user password',
  })
  @ApiResponse({ status: 204, description: 'Password updated' })
  @HttpCode(204)
  async changePassword(
    @Req() req: Request & { user: User; currentDevice: UserDevices },
    @Body(JoiPipe) body: PassUpdateDto,
  ) {
    return this.authService.changePassword(req.user, req.currentDevice, body);
  }

  @Post('/forgot-pass')
  @ApiOperation({
    summary: 'Restore code',
    description: 'Send to email restore code',
  })
  @ApiResponse({ status: 204, description: 'Code sent' })
  @HttpCode(204)
  async sendForgotPassword(
    @Req()
    req: Request,
    @Body(JoiPipe) body: EmailDto,
  ) {
    const ip: string = String(
      req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'unknown',
    );
    return this.authService.sendForgotPass(body, ip);
  }

  @Patch('/restore-pass/:key')
  @ApiOperation({
    summary: 'Restore user password',
    description: 'Update user password',
  })
  @ApiResponse({ status: 204, description: 'Password updated' })
  @HttpCode(204)
  async restorePassword(
    @Param('key', new JoiPipe(Joi.string().min(1).required())) key: string,
    @Body(JoiPipe) body: PassRestoreDto,
  ) {
    return this.authService.restorePassByEmail(key, body);
  }
}
