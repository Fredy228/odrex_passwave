import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PasswordCreateDto {
  @JoiSchema(
    Joi.string().min(1).max(250).required().messages({
      'string.empty': 'The name is empty.',
      'string.max': 'The name cannot be more than 250 characters',
      'string.min': 'The name cannot be less than 1 characters',
    }),
  )
  @ApiProperty({ required: true })
  name: string;

  @JoiSchema(
    Joi.string().min(1).max(250).messages({
      'string.empty': 'The entry is empty.',
      'string.max': 'The entry cannot be more than 250 characters',
      'string.min': 'The entry cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  entry?: string;

  @JoiSchema(
    Joi.string().min(1).max(500).messages({
      'string.empty': 'The address is empty.',
      'string.max': 'The address cannot be more than 500 characters',
      'string.min': 'The address cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  address?: string;

  @JoiSchema(
    Joi.string().min(1).max(250).messages({
      'string.empty': 'The access is empty.',
      'string.max': 'The access cannot be more than 250 characters',
      'string.min': 'The access cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  access?: string;

  @JoiSchema(
    Joi.string().min(1).max(250).messages({
      'string.empty': 'The login is empty.',
      'string.max': 'The login cannot be more than 250 characters',
      'string.min': 'The login cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  login?: string;

  @JoiSchema(
    Joi.string().min(1).max(1000).messages({
      'string.empty': 'The password is empty.',
      'string.max': 'The password cannot be more than 1000 characters',
      'string.min': 'The password cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  password?: string;

  @JoiSchema(
    Joi.string().min(1).max(5000).messages({
      'string.empty': 'The password is empty.',
      'string.max': 'The password cannot be more than 5000 characters',
      'string.min': 'The password cannot be less than 1 characters',
    }),
  )
  @ApiProperty()
  notes?: string;
}
