import * as Joi from "joi";

export const hallSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).trim().required().label("name").messages({
    "string.empty": "The name is empty.",
    "string.min": "The name cannot be less than 1 characters",
    "string.max": "The name cannot be more than 100 characters",
  }),
  notes: Joi.string().min(1).max(5000).allow(null).label("notes").messages({
    "string.empty": "The notes is empty.",
    "string.max": "The notes cannot be more than 5000 characters",
    "string.min": "The notes cannot be less than 1 characters",
  }),
});

export const hallUpdateSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).trim().label("name").messages({
    "string.empty": "The name is empty.",
    "string.min": "The name cannot be less than 1 characters",
    "string.max": "The name cannot be more than 100 characters",
  }),
  notes: Joi.string().min(1).max(5000).allow(null).label("notes").messages({
    "string.empty": "The notes is empty.",
    "string.max": "The notes cannot be more than 5000 characters",
    "string.min": "The notes cannot be less than 1 characters",
  }),
});
