import * as Joi from "joi";

export const passSchema = Joi.object().keys({
  name: Joi.string().min(1).max(250).trim().label("name").required().messages({
    "string.empty": "The name is empty.",
    "string.max": "The name cannot be more than 250 characters",
    "string.min": "The name cannot be less than 1 characters",
  }),
  entry: Joi.string().min(1).max(250).trim().label("entry").messages({
    "string.empty": "The entry is empty.",
    "string.max": "The entry cannot be more than 250 characters",
    "string.min": "The entry cannot be less than 1 characters",
  }),
  address: Joi.string().min(1).max(500).trim().label("address").messages({
    "string.empty": "The address is empty.",
    "string.max": "The address cannot be more than 500 characters",
    "string.min": "The address cannot be less than 1 characters",
  }),
  access: Joi.string().min(1).max(250).trim().label("access").messages({
    "string.empty": "The access is empty.",
    "string.max": "The access cannot be more than 250 characters",
    "string.min": "The access cannot be less than 1 characters",
  }),
  login: Joi.string().min(1).max(250).trim().label("login").messages({
    "string.empty": "The login is empty.",
    "string.max": "The login cannot be more than 250 characters",
    "string.min": "The login cannot be less than 1 characters",
  }),
  password: Joi.string().min(1).max(1000).trim().label("password").messages({
    "string.empty": "The password is empty.",
    "string.max": "The password cannot be more than 1000 characters",
    "string.min": "The password cannot be less than 1 characters",
  }),
  notes: Joi.string().min(1).max(5000).trim().label("notes").messages({
    "string.empty": "The notes is empty.",
    "string.max": "The notes cannot be more than 5000 characters",
    "string.min": "The notes cannot be less than 1 characters",
  }),
});

export const passUpdateSchema = passSchema.keys({
  name: Joi.string().min(1).max(250).trim().label("name").messages({
    "string.empty": "The name is empty.",
    "string.max": "The name cannot be more than 250 characters",
    "string.min": "The name cannot be less than 1 characters",
  }),
});
