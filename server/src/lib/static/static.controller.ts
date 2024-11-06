import { Controller, Get, HttpCode, Param, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';
import { Response } from 'express';

import { ReqProtectedType } from '../../types/protect.type';
import { StaticService } from './static.service';

@ApiTags('Static')
@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('/passwords/*')
  @ApiOperation({
    summary: 'Get password file',
    description: 'Return file',
  })
  @ApiResponse({
    status: 200,
    description: 'File got',
  })
  @HttpCode(200)
  async getFilePass(
    @Req() { user }: ReqProtectedType,
    @Param('0', new JoiPipe(Joi.string().required()))
    path: string,
    @Res() res: Response,
  ) {
    const [filePath, fileObj] = await this.staticService.getPassFile(
      user,
      path,
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileObj.file_name)}"`,
    );

    res.sendFile(filePath);
  }
}
