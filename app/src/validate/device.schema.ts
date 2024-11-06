import * as Joi from "joi";

export const DeviceSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).trim().required().label("name").messages({
    "string.empty": "The name is empty.",
    "string.min": "The name cannot be less than 1 characters",
    "string.max": "The name cannot be more than 100 characters",
  }),
  interfaceName: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .allow(null)
    .label("interface")
    .messages({
      "string.empty": "The interface is empty.",
      "string.max": "The interface cannot be more than 100 characters",
      "string.min": "The interface cannot be less than 1 characters",
    }),
});

export const DeviceUpdateSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).trim().label("name").messages({
    "string.empty": "The name is empty.",
    "string.min": "The name cannot be less than 1 characters",
    "string.max": "The name cannot be more than 100 characters",
  }),
  interfaceName: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .allow(null)
    .label("interface")
    .messages({
      "string.empty": "The interface is empty.",
      "string.max": "The interface cannot be more than 100 characters",
      "string.min": "The interface cannot be less than 1 characters",
    }),
});
