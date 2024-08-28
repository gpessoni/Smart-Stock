import Joi from "joi";

export const createUserValidation = Joi.object({
    username: Joi.string().trim().min(2).max(50).required().messages({
        "any.required": "Nome de usuário é obrigatório",
        "string.empty": "Nome de usuário não pode ser vazio",
        "string.min": "Nome de usuário deve ter pelo menos {#limit} caracteres",
        "string.max": "Nome de usuário deve ter no máximo {#limit} caracteres",
    }),
    password: Joi.string().min(8).required().messages({
        "any.required": "Senha é obrigatória",
        "string.empty": "Senha não pode ser vazia",
        "string.min": "Senha deve ter pelo menos {#limit} caracteres",
    }),
    departmentId: Joi.string().uuid().required().messages({
        "any.required": "Departamento é obrigatório",
        "string.empty": "Departamento não pode ser vazio",
    }),
});

export const deleteUserValidation = Joi.string().uuid().required();

export const updateUserValidation = Joi.object({
    username: Joi.string().trim().min(2).max(50).messages({
        "string.min": "Nome de usuário deve ter pelo menos {#limit} caracteres",
        "string.max": "Nome de usuário deve ter no máximo {#limit} caracteres",
    }),
    password: Joi.string().min(8).messages({
        "string.min": "Senha deve ter pelo menos {#limit} caracteres",
    }),
    departmentId: Joi.string().uuid().messages({
        "string.empty": "Departamento não pode ser vazio",
    }),
});
