import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
  convert: true,
})
export class QuerySearchDto {
  @JoiSchema(Joi.array().items(Joi.number().integer()).length(2))
  range?: [number, number];

  @JoiSchema(
    Joi.array().items(Joi.string().max(20), Joi.valid('ASC', 'DESC')).length(2),
  )
  sort?: [string, 'ASC' | 'DESC'];

  @JoiSchema(Joi.object())
  filter?: {
    [key: string]: any;
  };
}
