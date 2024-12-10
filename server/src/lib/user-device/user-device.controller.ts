import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';

import { RolesGuard } from '../../guard/role/roles.guard';
import { UserDeviceService } from './user-device.service';
import { Roles } from '../../guard/role/roles.decorator';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { ReqProtectedType } from '../../types/protect.type';
import { UserDevices } from '../../entity/user-devices.entity';

@ApiTags('User device')
@Controller('user-device')
@UseGuards(RolesGuard)
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all user device',
    description: 'Return user device',
  })
  @ApiResponse({
    status: 200,
    description: 'User device got',
    type: [UserDevices],
  })
  @HttpCode(200)
  @Roles()
  async getAll(
    @Req() { user }: ReqProtectedType,
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.userDeviceService.getAll(user, query);
  }

  @Delete('/:user_device_id')
  @ApiOperation({
    summary: 'Delete user device',
    description: 'Return user device',
  })
  @ApiResponse({
    status: 200,
    description: 'User device deleted',
  })
  @HttpCode(200)
  @Roles()
  async delete(
    @Req() { user }: ReqProtectedType,
    @Param('user_device_id', new JoiPipe(Joi.number().integer().required()))
    deviceId: number,
  ) {
    return this.userDeviceService.delete(user, deviceId);
  }
}
