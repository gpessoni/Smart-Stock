import Joi from "joi"

export const createStorageAddressValidation = Joi.object({
    address: Joi.string().trim().min(2).max(50).required().messages({
        "any.required": "Address é obrigatório",
        "string.empty": "Address não pode estar vazio",
        "string.min": "Address deve ter pelo menos {#limit} caracteres",
        "string.max": "Address deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Description é obrigatório",
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
    storageId: Joi.string().uuid().required().messages({
        "any.required": "StorageId é obrigatório",
        "string.empty": "StorageId não pode estar vazio",
    }),
});

export const deleteStorageAddressValidation = Joi.string().uuid().required();

export const updateStorageAddressValidation = Joi.object({
    address: Joi.string().trim().min(2).max(50).optional().messages({
        "string.empty": "Address não pode estar vazio",
        "string.min": "Address deve ter pelo menos {#limit} caracteres",
        "string.max": "Address deve ter no máximo {#limit} caracteres",
    }),
    description: Joi.string().trim().min(2).max(100).optional().messages({
        "string.empty": "Description não pode estar vazio",
        "string.min": "Description deve ter pelo menos {#limit} caracteres",
        "string.max": "Description deve ter no máximo {#limit} caracteres",
    }),
    storageId: Joi.string().uuid().optional().messages({
        "string.empty": "StorageId não pode estar vazio",
    }),
});
