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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiPipe } from 'nestjs-joi';

import { UserService } from './user.service';
import { User } from '../../entity/user.entity';
import { UserDto } from './dto/user.dto';
import { RolesGuard } from '../../guard/role/roles.guard';
import { RoleEnum } from '../../enums/role.enum';
import { Roles } from '../../guard/role/roles.decorator';
import { ReqProtectedType } from '../../types/protect.type';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';
import { UserUpdateDto } from './dto/user.update.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({ summary: 'Add user', description: 'Return user' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: OmitType(User, ['password', 'devices']),
  })
  @HttpCode(201)
  @Roles(RoleEnum.ADMIN)
  async register(@Body(JoiPipe) body: UserDto): Promise<User> {
    return this.userService.create(body);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all users', description: 'Return users' })
  @ApiResponse({
    status: 200,
    description: 'Users got',
    type: [PickType(User, ['id', 'name', 'role', 'email'])],
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getAll(
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
  ) {
    return this.userService.getAll(query);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get your user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User got',
    type: [PickType(User, ['id', 'name', 'role', 'email', 'phone'])],
  })
  @HttpCode(200)
  @Roles()
  async getMe(@Req() req: ReqProtectedType) {
    return req.user;
  }

  @Get('/:user_id')
  @ApiOperation({ summary: 'Get your user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User got',
    type: [PickType(User, ['id', 'name', 'role', 'email', 'phone'])],
  })
  @HttpCode(200)
  @Roles(RoleEnum.ADMIN)
  async getUserById(
    @Param('user_id', new JoiPipe(Joi.number().integer().required()))
    userId: number,
  ) {
    return this.userService.getById(userId);
  }

  @Patch('/:user_id')
  @ApiOperation({ summary: 'Update user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: OmitType(User, ['password', 'devices']),
  })
  @HttpCode(200)
  @Roles()
  async update(
    @Req() req: ReqProtectedType,
    @Param('user_id', new JoiPipe(Joi.number().integer().required()))
    userId: number,
    @Body(JoiPipe) body: UserUpdateDto,
  ): Promise<User> {
    return this.userService.update(req.user, userId, body);
  }

  @Delete('/:user_id')
  @ApiOperation({ summary: 'Delete user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: OmitType(User, ['password', 'devices']),
  })
  @HttpCode(200)
  @Roles()
  async delete(
    @Req() req: ReqProtectedType,
    @Param('user_id', new JoiPipe(Joi.number().integer().required()))
    userId: number,
  ): Promise<User> {
    return this.userService.delete(req.user, userId);
  }
}
