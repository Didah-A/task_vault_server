import Joi from "joi";

export const createTaskValidation = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(1000).required(),
});
