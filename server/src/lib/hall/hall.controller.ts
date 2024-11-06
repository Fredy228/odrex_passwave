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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';

import { HallService } from './hall.service';
import { RolesGuard } from '../../guard/role/roles.guard';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { HallCreateDto } from './dto/hall.create.dto';
import { Hall } from '../../entity/hall.entity';
import { ReqProtectedType } from '../../types/protect.type';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { HallUpdateDto } from './dto/hall.update.dto';

@ApiTags('hall')
@Controller('hall')
@UseGuards(RolesGuard)
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Post('/:company_id')
  @ApiOperation({ summary: 'Add hall', description: 'Return hall' })
  @ApiResponse({
    status: 201,
    description: 'Hall created',
    type: Hall,
  })
  @HttpCode(201)
  @Roles(RoleEnum.ADMIN)
  async create(
    @Param('company_id', new JoiPipe(Joi.number().integer().required()))
    companyId: number,
    @Body(JoiPipe) body: HallCreateDto,
  ) {
    return this.hallService.create(companyId, body);
  }

  @Get('/:company_id')
  @ApiOperation({
    summary: 'Get all halls',
    description: 'Return halls',
  })
  @ApiResponse({
    status: 200,
    description: 'Halls got',
    type: [Hall],
  })
  @HttpCode(200)
  @Roles()
  async getAll(
    @Req() { user }: ReqProtectedType,
    @Param('company_id', new JoiPipe(Joi.number().integer().required()))
    companyId: number,
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.hallService.getAll(user, query, companyId);
  }

  @Get('/id/:hall_id')
  @ApiOperation({ summary: 'Get by id hall', description: 'Return hall' })
  @ApiResponse({
    status: 200,
    description: 'Hall got',
    type: Hall,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getById(
    @Param('hall_id', new JoiPipe(Joi.number().integer().required()))
    hallId: number,
  ) {
    return this.hallService.getById(hallId);
  }

  @Patch('/:hall_id')
  @ApiOperation({ summary: 'Update hall', description: 'Return hall' })
  @ApiResponse({
    status: 200,
    description: 'Hall updated',
    type: Hall,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('hall_id', new JoiPipe(Joi.number().integer().required()))
    hallId: number,
    @Body(JoiPipe) body: Partial<HallUpdateDto>,
  ) {
    return this.hallService.update(hallId, body);
  }

  @Delete('/:hall_id')
  @ApiOperation({ summary: 'Delete hall', description: 'Return hall' })
  @ApiResponse({
    status: 200,
    description: 'Hall deleted',
    type: Hall,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Param('hall_id', new JoiPipe(Joi.number().integer().required()))
    hallId: number,
  ) {
    return this.hallService.delete(hallId);
  }
}
