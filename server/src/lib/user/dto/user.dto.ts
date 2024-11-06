import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { RoleEnum } from '../../../enums/role.enum';
import { UserPhoneType } from '../../../types/user.type';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UserDto {
  @ApiProperty({ required: true })
  @JoiSchema(
    Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'The email is incorrect',
        'string.empty': 'The email is empty.',
      }),
  )
  email: string;

  @JoiSchema(
    Joi.string().min(1).max(40).required().messages({
      'string.empty': 'The password is empty.',
      'string.max': 'The password cannot be more than 40 characters',
      'string.min': 'The password cannot be less than 1 characters',
    }),
  )
  @ApiProperty({ required: true })
  name: string;

  @JoiSchema(
    Joi.string()
      .regex(/(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,30}/)
      .required()
      .messages({
        'string.empty': 'The password is empty.',
        'string.pattern.base':
          'Password may have a minimum of 8 characters, including at least one capital letter and one number',
      }),
  )
  password: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(RoleEnum))
      .default(RoleEnum.USER),
  )
  @ApiProperty()
  role: RoleEnum;

  @JoiSchema(
    Joi.object({
      country: Joi.string().min(1).max(3).messages({
        'string.empty': 'countryCode|The country code is empty.',
        'string.min':
          'countryCode|The country code cannot be less than 1 characters',
        'string.max':
          'countryCode|The country code cannot be more than 3 characters',
      }),
      number: Joi.string().min(2).max(30).messages({
        'number.empty': 'numberPhone|The number phone is empty.',
        'number.min':
          'numberPhone|The number phone cannot be less than 2 characters',
        'number.max':
          'numberPhone|The number phone cannot be more than 30 characters',
      }),
    }).allow(null),
  )
  phone?: UserPhoneType | null;

  @JoiSchema(Joi.string().min(1))
  avatar?: string;
}
