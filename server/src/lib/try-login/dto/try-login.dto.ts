import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TryLoginDto {
  @JoiSchema(Joi.array().items(Joi.number().integer().default([])))
  @ApiProperty()
  ids: number[];
}
