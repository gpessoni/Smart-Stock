import Joi from "joi";
export const createStockRequestValidation = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().uuid().required().messages({
          "string.empty": "Product ID é obrigatório",
          "string.uuid": "Product ID deve ser um UUID válido",
        }),
        storageAddressId: Joi.string().uuid().required().messages({
          "string.empty": "Storage Address ID é obrigatório",
          "string.uuid": "Storage Address ID deve ser um UUID válido",
        }),
        quantity: Joi.number().integer().positive().required().messages({
          "number.base": "Quantity deve ser um número",
          "number.integer": "Quantity deve ser um número inteiro",
          "number.positive": "Quantity deve ser um número positivo",
          "any.required": "Quantity é obrigatório",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Items deve ser um array",
      "array.includesRequiredUnknowns": "Items não pode estar vazio",
    }),
});

export const updateStockRequestStatusValidation = Joi.object({
  id: Joi.string().uuid().required(),
  status: Joi.string().valid("APPROVED", "REJECTED").required(),
});
