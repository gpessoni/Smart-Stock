import Joi from "joi";

// Validação para criar uma nova ordem de separação
export const createSeparationOrderValidation = Joi.object({
  code: Joi.string().trim().min(3).max(20).required().messages({
    "any.required": "Código é obrigatório",
    "string.empty": "Código não pode estar vazio",
    "string.min": "Código deve ter pelo menos {#limit} caracteres",
    "string.max": "Código deve ter no máximo {#limit} caracteres",
  }),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().uuid().required().messages({
          "any.required": "ID do produto é obrigatório",
          "string.empty": "ID do produto não pode estar vazio",
          "string.guid": "ID do produto deve ser um UUID válido",
        }),
        storageAddressId: Joi.string().uuid().required().messages({
          "any.required": "ID do endereço de armazenamento é obrigatório",
          "string.empty":
            "ID do endereço de armazenamento não pode estar vazio",
          "string.guid":
            "ID do endereço de armazenamento deve ser um UUID válido",
        }),
        quantity: Joi.number().integer().positive().required().messages({
          "any.required": "Quantidade é obrigatória",
          "number.base": "Quantidade deve ser um número",
          "number.positive": "Quantidade deve ser um número positivo",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Pelo menos um item é necessário",
    }),
});

// Validação para atualizar o status de uma ordem de separação
export const updateSeparationOrderStatusValidation = Joi.object({
  status: Joi.string()
    .valid("PENDING", "SEPARATED", "DELIVERED")
    .required()
    .messages({
      "any.required": "Status é obrigatório",
      "any.only":
        "Status deve ser um dos seguintes valores: PENDING, SEPARATED, DELIVERED",
    }),
});

// Validação para exclusão e busca por ID
export const idValidation = Joi.string().uuid().required().messages({
  "any.required": "ID é obrigatório",
  "string.guid": "ID deve ser um UUID válido",
});
