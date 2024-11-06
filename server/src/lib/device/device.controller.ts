import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';

import { DeviceService } from './device.service';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { Device } from '../../entity/device.entity';
import { DeviceCreateDto } from './dto/device.create.dto';
import { ReqProtectedType } from '../../types/protect.type';
import { DeviceUpdateDto } from './dto/device.update.dto';
import { RolesGuard } from '../../guard/role/roles.guard';

@ApiTags('Device')
@Controller('device')
@UseGuards(RolesGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('/:hall_id')
  @ApiOperation({ summary: 'Add device', description: 'Return device' })
  @ApiResponse({
    status: 201,
    description: 'Device created',
    type: Device,
  })
  @HttpCode(201)
  @Roles(RoleEnum.ADMIN)
  async create(
    @Param('hall_id', new JoiPipe(Joi.number().integer().required()))
    hallId: number,
    @Body(JoiPipe) body: DeviceCreateDto,
  ) {
    return this.deviceService.create(hallId, body);
  }

  @Get('/:hall_id')
  @ApiOperation({
    summary: 'Get all devices',
    description: 'Return devices',
  })
  @ApiResponse({
    status: 200,
    description: 'Devices got',
    type: [Device],
  })
  @HttpCode(200)
  @Roles()
  async getAll(
    @Req() { user }: ReqProtectedType,
    @Param('hall_id', new JoiPipe(Joi.number().integer().required()))
    hallId: number,
  ) {
    return this.deviceService.getAll(user, hallId);
  }

  @Get('/id/:device_id')
  @ApiOperation({ summary: 'Get by id device', description: 'Return device' })
  @ApiResponse({
    status: 200,
    description: 'Device got',
    type: Device,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getById(
    @Param('device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
  ) {
    return this.deviceService.getById(deviceId);
  }

  @Patch('/:device_id')
  @ApiOperation({ summary: 'Update device', description: 'Return device' })
  @ApiResponse({
    status: 200,
    description: 'Device updated',
    type: Device,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
    @Body(JoiPipe) body: Partial<DeviceUpdateDto>,
  ) {
    return this.deviceService.update(deviceId, body);
  }

  @Delete('/:device_id')
  @ApiOperation({ summary: 'Delete device', description: 'Return device' })
  @ApiResponse({
    status: 200,
    description: 'Device deleted',
    type: Device,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Param('device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
  ) {
    return this.deviceService.delete(deviceId);
  }
}
