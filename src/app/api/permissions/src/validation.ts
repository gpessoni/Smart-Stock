import Joi from "joi"

export const createPermissionValidation = Joi.object({
    route: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Route é obrigatório",
        "string.empty": "Route não pode estar vazio",
        "string.min": "Route deve ter pelo menos {#limit} caracteres",
        "string.max": "Route deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Description é obrigatório",
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
});

export const deletePermissionValidation = Joi.string().uuid().required();

export const updatePermissionValidation = Joi.object({
    route: Joi.string().trim().min(2).max(20).optional().messages({
        "string.empty": "Route não pode estar vazio",
        "string.min": "Route deve ter pelo menos {#limit} caracteres",
        "string.max": "Route deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).optional().messages({
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
});
