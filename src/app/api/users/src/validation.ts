import Joi from "joi"

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
})

export const deleteUserValidation = Joi.string().uuid().required()

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
})

export const loginValidation = Joi.object({
    username: Joi.string().trim().required().messages({
        "any.required": "O nome de usuário é obrigatório",
        "string.empty": "O nome de usuário não pode estar vazio",
    }),
    password: Joi.string().trim().required().messages({
        "any.required": "A senha é obrigatória",
        "string.empty": "A senha não pode estar vazia",
    }),
})

export const addPermissionToUserValidation = Joi.object({
    userId: Joi.string().uuid().required().messages({
        "any.required": "User ID é obrigatório",
        "string.empty": "User ID não pode estar vazio",
        "string.uuid": "User ID deve ser um UUID válido",
    }),
    permissionId: Joi.string().uuid().required().messages({
        "any.required": "Permission ID é obrigatório",
        "string.empty": "Permission ID não pode estar vazio",
        "string.uuid": "Permission ID deve ser um UUID válido",
    }),
})

export const removePermissionFromUserValidation = Joi.object({
    userId: Joi.string().uuid().required().messages({
        "any.required": "User ID é obrigatório",
        "string.empty": "User ID não pode estar vazio",
        "string.uuid": "User ID deve ser um UUID válido",
    }),
    permissionId: Joi.string().uuid().required().messages({
        "any.required": "Permission ID é obrigatório",
        "string.empty": "Permission ID não pode estar vazio",
        "string.uuid": "Permission ID deve ser um UUID válido",
    }),
})

export const getUserPermissionsValidation = Joi.object({
    userId: Joi.string().uuid().required().messages({
        "any.required": "User ID é obrigatório",
        "string.empty": "User ID não pode estar vazio",
        "string.uuid": "User ID deve ser um UUID válido",
    }),
})
