import Joi from "joi";

export const createUnitOfMeasureValidation = Joi.object({
  abbreviation: Joi.string().trim().min(0).max(5).required().messages({
    "any.required": "abbreviation é obrigatório",
    "string.empty": "abbreviation não pode estar vazio",
    "string.min": "abbreviation deve ter pelo menos {#limit} caracteres",
    "string.max": "abbreviation deve ter no máximo {#limit} caracteres",
  }),
  description: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Description é obrigatório",
    "string.empty": "Description não pode estar vazio",
    "string.min": "Description deve ter pelo menos {#limit} caracteres",
    "string.max": "Description deve ter no máximo {#limit} caracteres",
  }),
});

export const deleteUnitOfMeasureValidation = Joi.string().uuid().required();

export const updateUnitOfMeasureValidation = Joi.object({
  abbreviation: Joi.string().trim().min(0).max(5).required().messages({
    "any.required": "abbreviation é obrigatório",
    "string.empty": "abbreviation não pode estar vazio",
    "string.min": "abbreviation deve ter pelo menos {#limit} caracteres",
    "string.max": "abbreviation deve ter no máximo {#limit} caracteres",
  }),
  description: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Description não pode estar vazio",
    "string.min": "Description deve ter pelo menos {#limit} caracteres",
    "string.max": "Description deve ter no máximo {#limit} caracteres",
  }),
});
