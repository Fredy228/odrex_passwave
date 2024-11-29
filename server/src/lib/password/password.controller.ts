import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';

import { PasswordService } from './password.service';
import { RolesGuard } from '../../guard/role/roles.guard';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { PasswordCreateDto } from './dto/password.create.dto';
import { Password } from '../../entity/password.entity';
import { FileValidatorPipe } from '../../pipe/validator-file.pipe';
import { ReqProtectedType } from '../../types/protect.type';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PasswordUpdateDto } from './dto/password.update.dto';

@ApiTags('Password')
@Controller('password')
@UseGuards(RolesGuard)
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('/:device_id')
  @ApiOperation({ summary: 'Add password', description: 'Return password' })
  @ApiResponse({
    status: 201,
    description: 'Password created',
    type: Password,
  })
  @HttpCode(201)
  @UsePipes(
    new FileValidatorPipe({
      nullable: true,
      maxSize: 100,
    }),
  )
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  @Roles(RoleEnum.ADMIN)
  async create(
    @Param('device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
    @Body(JoiPipe) body: PasswordCreateDto,
    @UploadedFiles()
    files: {
      files?: Array<Express.Multer.File>;
    },
  ) {
    return this.passwordService.create(deviceId, body, files?.files || []);
  }

  @Get('/:device_id')
  @ApiOperation({
    summary: 'Get all password',
    description: 'Return password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password got',
    type: [Password],
  })
  @HttpCode(200)
  @Roles()
  async getAll(
    @Req() { user }: ReqProtectedType,
    @Param('device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.passwordService.getAll(deviceId, user, query);
  }

  @Get('/id/:device_id')
  @ApiOperation({
    summary: 'Get by id password',
    description: 'Return password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password got',
    type: Password,
  })
  @HttpCode(200)
  @Roles()
  async getById(
    @Req() { user }: ReqProtectedType,
    @Param('device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
  ) {
    return this.passwordService.getById(user, deviceId);
  }

  @Patch('/:pass_id')
  @ApiOperation({ summary: 'Update password', description: 'Return password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: Password,
  })
  @HttpCode(200)
  @UsePipes(
    new FileValidatorPipe({
      nullable: true,
      maxSize: 100,
    }),
  )
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  @Roles()
  async update(
    @Req() { user }: ReqProtectedType,
    @Param('pass_id', new JoiPipe(Joi.number().integer().required()))
    passId: number,
    @Body(JoiPipe) body: Partial<PasswordUpdateDto>,
    @UploadedFiles()
    files: {
      files?: Array<Express.Multer.File>;
    },
  ) {
    return this.passwordService.update(user, passId, body, files?.files || []);
  }

  @Delete('/:pass_id')
  @ApiOperation({ summary: 'Delete password', description: 'Return password' })
  @ApiResponse({
    status: 200,
    description: 'Password deleted',
    type: Password,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Param('pass_id', new JoiPipe(Joi.number().integer().required()))
    passId: number,
  ) {
    return this.passwordService.delete(passId);
  }

  @Delete('file/:pass_id/:file_key')
  @ApiOperation({ summary: 'Delete file', description: 'Return void' })
  @ApiResponse({
    status: 200,
    description: 'File deleted',
    type: Password,
  })
  @HttpCode(200)
  @Roles()
  async deleteFile(
    @Req() { user }: ReqProtectedType,
    @Param('pass_id', new JoiPipe(Joi.number().integer().required()))
    passId: number,
    @Param('file_key', new JoiPipe(Joi.string().required()))
    fileKey: string,
  ) {
    return this.passwordService.deleteFile(user, passId, fileKey);
  }
}
