import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class HallUpdateDto {
  @JoiSchema(
    Joi.string().min(1).max(100).messages({
      'string.empty': 'The name is empty.',
      'string.max': 'The name cannot be more than 100 characters',
      'string.min': 'The name cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  name: string;

  @JoiSchema(
    Joi.string().min(1).max(5000).allow(null).messages({
      'string.empty': 'The notes is empty.',
      'string.max': 'The notes cannot be more than 5000 characters',
      'string.min': 'The notes cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  notes?: string;
}
