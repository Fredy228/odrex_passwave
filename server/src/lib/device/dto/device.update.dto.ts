import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class DeviceUpdateDto {
  @JoiSchema(
    Joi.string().min(1).max(100).required().messages({
      'string.empty': 'The name is empty.',
      'string.max': 'The name cannot be more than 100 characters',
      'string.min': 'The name cannot be less than 1 characters',
    }),
  )
  @ApiProperty({ required: true })
  name: string;

  @JoiSchema(
    Joi.string().min(1).max(100).allow(null).default(null).messages({
      'string.empty': 'The interface is empty.',
      'string.max': 'The interface cannot be more than 100 characters',
      'string.min': 'The interface cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  interface: string;

  @JoiSchema(
    Joi.string().min(1).max(250).required().messages({
      'string.empty': 'The image is empty.',
      'string.max': 'The image cannot be more than 250 characters',
      'string.min': 'The image cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  image: string;

  @JoiSchema(Joi.array().items(Joi.number().integer().min(1)))
  @ApiProperty()
  edges_to: number[];
}
