import * as Joi from "joi";

import { RoleEnum } from "@/enum/role.enum";

export const userUpdateSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .label("email")
      .messages({
        "string.email": "The email is incorrect",
        "string.empty": "The email is empty.",
      }),
    name: Joi.string().min(2).max(30).trim().label("name").messages({
      "string.empty": "The name is empty.",
      "string.min": "The name cannot be less than 2 characters",
      "string.max": "The name cannot be more than 30 characters",
    }),
    role: Joi.string()
      .valid(...Object.values(RoleEnum))
      .label("role"),
  })
  .options({ stripUnknown: false });
