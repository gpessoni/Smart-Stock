import Joi from "joi";

export const createTransferValidation = Joi.object({
  productId: Joi.string().uuid().required(),
  fromAddressId: Joi.string().uuid().required(),
  toAddressId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().positive().required(),
});
