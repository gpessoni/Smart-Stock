import Joi from "joi"

export const createProductValidation = Joi.object({
    code: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Código é obrigatório",
        "string.empty": "Código não pode estar vazio",
        "string.min": "Código deve ter pelo menos {#limit} caracteres",
        "string.max": "Código deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Descrição é obrigatória",
        "string.empty": "Descrição não pode estar vazia",
        "string.min": "Descrição deve ter pelo menos {#limit} caracteres",
        "string.max": "Descrição deve ter no máximo {#limit} caracteres",
    }),
    typeProductId: Joi.string().uuid().required(),
    groupProductId: Joi.string().uuid().required(),
    unitOfMeasureId: Joi.string().uuid().required(),
    image: Joi.string().base64().optional().allow(null).messages({
        "string.base": "Imagem deve estar em formato Base64",
    }),
})

export const updateProductValidation = Joi.object({
    code: Joi.string().trim().min(2).max(20).optional().messages({
        "string.empty": "Código não pode estar vazio",
        "string.min": "Código deve ter pelo menos {#limit} caracteres",
        "string.max": "Código deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).optional().messages({
        "string.empty": "Descrição não pode estar vazia",
        "string.min": "Descrição deve ter pelo menos {#limit} caracteres",
        "string.max": "Descrição deve ter no máximo {#limit} caracteres",
    }),
    typeProductId: Joi.string().uuid().optional(),
    groupProductId: Joi.string().uuid().optional(),
    unitOfMeasureId: Joi.string().uuid().optional(),
    image: Joi.string().base64().optional().allow(null).messages({
        "string.base": "Imagem deve estar em formato Base64",
    }),
})

export const deleteProductValidation = Joi.string().uuid().required()
