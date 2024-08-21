import Joi from "joi"

export const createStorageValidation = Joi.object({
    code: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Code é obrigatório",
        "string.empty": "Code não pode estar vazio",
        "string.min": "Code deve ter pelo menos {#limit} caracteres",
        "string.max": "Code deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Description é obrigatório",
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
});

export const deleteStorageValidation = Joi.string().uuid().required();

export const updateStorageValidation = Joi.object({
    code: Joi.string().trim().min(2).max(20).optional().messages({
        "string.empty": "Code não pode estar vazio",
        "string.min": "Code deve ter pelo menos {#limit} caracteres",
        "string.max": "Code deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).optional().messages({
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
});
