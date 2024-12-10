import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guard/role/roles.guard';
import { TryLoginService } from './try-login.service';
import { Roles } from '../../guard/role/roles.decorator';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { JoiPipe } from 'nestjs-joi';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { TryLogin } from '../../entity/try-login.entity';
import { RoleEnum } from '../../enums/role.enum';
import { TryLoginDto } from './dto/try-login.dto';
import * as Joi from 'joi';

@ApiTags('Try login')
@Controller('try-login')
@UseGuards(RolesGuard)
export class TryLoginController {
  constructor(private readonly tryLoginService: TryLoginService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all history',
    description: 'Return history',
  })
  @ApiResponse({
    status: 200,
    description: 'History got',
    type: [TryLogin],
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getAll(
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.tryLoginService.getAll(query);
  }

  @Delete('/')
  @ApiOperation({ summary: 'Delete history', description: 'Return history' })
  @ApiResponse({
    status: 204,
    description: 'History deleted',
  })
  @HttpCode(204)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Query(new QueryValidationPipe(['ids']), JoiPipe)
    query: TryLoginDto,
  ) {
    return this.tryLoginService.delete(query.ids);
  }

  @Get('/blocked')
  @ApiOperation({
    summary: 'Get all blocked ips',
    description: 'Return blocked ips',
  })
  @ApiResponse({
    status: 200,
    description: 'Blocked ips got',
    type: [TryLogin],
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getAllBlocked(
    @Query(new QueryValidationPipe(['filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.tryLoginService.getBlockedIp(query.filter);
  }

  @Delete('/blocked/:ip')
  @ApiOperation({ summary: 'Unblock ip', description: 'Return void' })
  @ApiResponse({
    status: 204,
    description: 'Unblocked ip',
  })
  @HttpCode(204)
  @Roles(RoleEnum.ADMIN)
  async unblock(
    @Param('ip', new JoiPipe(Joi.string().ip().required()))
    ip: string,
  ) {
    return this.tryLoginService.unblock(ip);
  }
}
