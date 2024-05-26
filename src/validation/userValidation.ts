import Joi from "joi";

export const createUserValidation = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(3).max(255).email().required(),
  password: Joi.string().min(3).max(255).required(),
});

export const signinValidation = Joi.object({
  email: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
});
