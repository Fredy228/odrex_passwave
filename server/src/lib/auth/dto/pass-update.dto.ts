import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PassUpdateDto {
  @ApiProperty()
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
  newPass: string;

  @JoiSchema(Joi.string().min(8).max(30).required())
  currentPass: string;
}
