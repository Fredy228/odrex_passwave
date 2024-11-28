import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';
import { Permit } from '../../../enums/permit.enum';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PrivilegeCreateDto {
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Permit))
      .required(),
  )
  @ApiProperty()
  access: Permit;
}
