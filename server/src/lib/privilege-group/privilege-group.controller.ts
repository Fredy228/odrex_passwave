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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';

import { PrivilegeGroupService } from './privilege-group.service';
import { RolesGuard } from '../../guard/role/roles.guard';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { PrivilegeGroup } from '../../entity/privilege-group.entity';
import { PrivilegeGroupCreateDto } from './dto/privilege-group.create.dto';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { PrivilegeGroupUpdateDto } from './dto/privilege-group.update.dto';

@ApiTags('Privilege group')
@Controller('privilege-group')
@UseGuards(RolesGuard)
export class PrivilegeGroupController {
  constructor(private readonly privilegeGroupService: PrivilegeGroupService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Add privilege group',
    description: 'Return privilege group',
  })
  @ApiResponse({
    status: 201,
    description: 'Privilege group created',
    type: PrivilegeGroup,
  })
  @HttpCode(201)
  @Roles(RoleEnum.ADMIN)
  async create(@Body(JoiPipe) body: PrivilegeGroupCreateDto) {
    return this.privilegeGroupService.create(body);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get all privilege group',
    description: 'Return privilege group',
  })
  @ApiResponse({
    status: 200,
    description: 'Privilege group got',
    type: [PrivilegeGroup],
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getAll(
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.privilegeGroupService.getAll(query);
  }

  @Patch('/:group_id')
  @ApiOperation({
    summary: 'Update privilege group',
    description: 'Return privilege group',
  })
  @ApiResponse({
    status: 200,
    description: 'Privilege group updated',
    type: PrivilegeGroup,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('group_id', new JoiPipe(Joi.number().integer().required()))
    groupId: number,
    @Body(JoiPipe) body: Partial<PrivilegeGroupUpdateDto>,
  ) {
    return this.privilegeGroupService.update(groupId, body);
  }

  @Patch('/:action/:group_id/:user_id')
  @ApiOperation({
    summary: 'Add or remove relation privilege group',
    description: 'Return privilege group',
  })
  @ApiResponse({
    status: 204,
    description: 'Successful',
  })
  @HttpCode(204)
  @Roles(RoleEnum.ADMIN)
  async addOrRemoveUser(
    @Param('group_id', new JoiPipe(Joi.number().integer().required()))
    groupId: number,
    @Param('user_id', new JoiPipe(Joi.number().integer().required()))
    userId: number,
    @Param(
      'action',
      new JoiPipe(Joi.string().valid('add', 'remove').required()),
    )
    action: 'add' | 'remove',
  ): Promise<void> {
    return this.privilegeGroupService.userAddOrRemove(userId, groupId, action);
  }

  @Delete('/:group_id')
  @ApiOperation({
    summary: 'Delete privilege group',
    description: 'Return privilege group',
  })
  @ApiResponse({
    status: 200,
    description: 'Privilege group deleted',
    type: PrivilegeGroup,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Param('group_id', new JoiPipe(Joi.number().integer().required()))
    groupId: number,
  ) {
    return this.privilegeGroupService.delete(groupId);
  }
}
