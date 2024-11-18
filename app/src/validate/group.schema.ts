import * as Joi from "joi";

export const groupSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).trim().required().label("name").messages({
    "string.empty": "The name is empty.",
    "string.min": "The name cannot be less than 1 characters",
    "string.max": "The name cannot be more than 100 characters",
  }),
});

export const groupUpdateSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).trim().label("name").messages({
    "string.empty": "The name is empty.",
    "string.min": "The name cannot be less than 1 characters",
    "string.max": "The name cannot be more than 100 characters",
  }),
});
