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
import { ApiOperation, ApiResponse, ApiTags, PickType } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiPipe } from 'nestjs-joi';

import { RolesGuard } from '../../guard/role/roles.guard';
import { CompanyService } from './company.service';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/role.enum';
import { Company } from '../../entity/company.entity';
import { CompanyCreateDto } from './dto/company.create.dto';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { ReqProtectedType } from '../../types/protect.type';
import { CompanyUpdateDto } from './dto/company.update.dto';

@ApiTags('Company')
@Controller('company')
@UseGuards(RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/')
  @ApiOperation({ summary: 'Add company', description: 'Return company' })
  @ApiResponse({
    status: 201,
    description: 'Company created',
    type: Company,
  })
  @HttpCode(201)
  @Roles(RoleEnum.ADMIN)
  async create(@Body(JoiPipe) body: CompanyCreateDto) {
    return this.companyService.create(body);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get all companies',
    description: 'Return companies',
  })
  @ApiResponse({
    status: 200,
    description: 'Companies got',
    type: [Company],
  })
  @HttpCode(200)
  @Roles()
  async getAll(
    @Req() { user }: ReqProtectedType,
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.companyService.getAll(user, query);
  }

  @Get('/:company_id')
  @ApiOperation({ summary: 'Get by id company', description: 'Return company' })
  @ApiResponse({
    status: 200,
    description: 'Company got',
    type: Company,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getById(
    @Param('company_id', new JoiPipe(Joi.number().integer().required()))
    companyId: number,
  ) {
    return this.companyService.getById(companyId);
  }

  @Patch('/:company_id')
  @ApiOperation({ summary: 'Update company', description: 'Return company' })
  @ApiResponse({
    status: 200,
    description: 'Company updated',
    type: Company,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('company_id', new JoiPipe(Joi.number().integer().required()))
    companyId: number,
    @Body(JoiPipe) body: Partial<CompanyUpdateDto>,
  ) {
    return this.companyService.update(companyId, body);
  }

  @Delete('/:company_id')
  @ApiOperation({ summary: 'Delete company', description: 'Return company' })
  @ApiResponse({
    status: 200,
    description: 'Company deleted',
    type: Company,
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async delete(
    @Param('company_id', new JoiPipe(Joi.number().integer().required()))
    companyId: number,
  ) {
    return this.companyService.delete(companyId);
  }
}
