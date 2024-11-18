import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PrivilegeGroupCreateDto {
  @JoiSchema(
    Joi.string().min(1).max(100).required().messages({
      'string.empty': 'The name is empty.',
      'string.max': 'The name cannot be more than 100 characters',
      'string.min': 'The name cannot be less than 1 characters',
    }),
  )
  @ApiProperty({ required: true })
  name: string;
}
