import Joi from "joi"

export const createDepartmentValidation = Joi.object({
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Description é obrigatório",
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
})

export const deleteDepartmentValidation = Joi.string().uuid().required()

export const updateDepartmentValidation = Joi.object({
    description: Joi.string().trim().min(2).max(100).optional().messages({
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
})

export const addPermissionToDepartmentValidation = Joi.object({
    departmentId: Joi.string().uuid().required().messages({
        "any.required": "Department ID é obrigatório",
        "string.empty": "Department ID não pode estar vazio",
        "string.uuid": "Department ID deve ser um UUID válido",
    }),
    permissionId: Joi.string().uuid().required().messages({
        "any.required": "Permission ID é obrigatório",
        "string.empty": "Permission ID não pode estar vazio",
        "string.uuid": "Permission ID deve ser um UUID válido",
    }),
})

export const removePermissionFromDepartmentValidation = Joi.object({
    departmentId: Joi.string().uuid().required().messages({
        "any.required": "Department ID é obrigatório",
        "string.empty": "Department ID não pode estar vazio",
        "string.uuid": "Department ID deve ser um UUID válido",
    }),
    permissionId: Joi.string().uuid().required().messages({
        "any.required": "Permission ID é obrigatório",
        "string.empty": "Permission ID não pode estar vazio",
        "string.uuid": "Permission ID deve ser um UUID válido",
    }),
})

export const getDepartmentPermissionsValidation = Joi.object({
    departmentId: Joi.string().uuid().required().messages({
        "any.required": "Department ID é obrigatório",
        "string.empty": "Department ID não pode estar vazio",
        "string.uuid": "Department ID deve ser um UUID válido",
    }),
})
