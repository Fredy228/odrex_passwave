import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';

import { PrivilegeService } from './privilege.service';
import { RolesGuard } from '../../guard/role/roles.guard';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { Privilege } from '../../entity/privilege.entity';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { EPrivilegeList, EPrivilegeType } from '../../enums/privilege.enum';
import { PrivilegeCreateDto } from './dto/privilege.create.dto';
import { CustomException } from '../../services/custom-exception';

@ApiTags('Privilege')
@Controller('privilege')
@UseGuards(RolesGuard)
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @Post('/:type/:id/:list/:target_id')
  @ApiOperation({
    summary: 'Add privilege by user',
    description: 'Return privilege',
  })
  @ApiResponse({
    status: 201,
    description: 'Privilege created',
    type: Privilege,
  })
  @HttpCode(201)
  @Roles(RoleEnum.ADMIN)
  createByUser(
    @Param(
      'type',
      new JoiPipe(
        Joi.string()
          .valid(...Object.values(EPrivilegeType))
          .required(),
      ),
    )
    type: EPrivilegeType,
    @Param('id', new JoiPipe(Joi.number().integer().required()))
    id: number,
    @Param(
      'list',
      new JoiPipe(
        Joi.string()
          .valid(...Object.values(EPrivilegeList))
          .required(),
      ),
    )
    list: EPrivilegeList,
    @Param('target_id', new JoiPipe(Joi.number().integer().required()))
    targetId: number,
    @Body(JoiPipe) body: PrivilegeCreateDto,
  ) {
    switch (type) {
      case EPrivilegeType.USER:
        return this.privilegeService.createByUser(id, list, targetId, body);
      case EPrivilegeType.GROUP:
        return this.privilegeService.createByGroup(id, list, targetId, body);
      default:
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          'Wrong type privilege',
        );
    }
  }

  @Get('/:type/:list/:id')
  @ApiOperation({
    summary: 'Get all privilege',
    description: 'Return privilege',
  })
  @ApiResponse({
    status: 200,
    description: 'Privilege got',
    type: [Privilege],
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getAll(
    @Param(
      'type',
      new JoiPipe(
        Joi.string()
          .valid(...Object.values(EPrivilegeType))
          .required(),
      ),
    )
    type: EPrivilegeType,
    @Param(
      'list',
      new JoiPipe(
        Joi.string()
          .valid(...Object.values(EPrivilegeList))
          .required(),
      ),
    )
    list: EPrivilegeList,
    @Param('id', new JoiPipe(Joi.number().integer().required()))
    id: number,
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.privilegeService.getAll(type, list, id, query);
  }
}