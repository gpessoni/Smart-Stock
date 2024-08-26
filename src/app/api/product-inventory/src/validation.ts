import Joi from "joi";

export const createProductInventoryValidation = Joi.object({
    productId: Joi.string().uuid().required().messages({
        "any.required": "ProductId é obrigatório",
        "string.empty": "ProductId não pode estar vazio",
        "string.uuid": "ProductId deve ser um UUID válido",
    }),
    storageAddressId: Joi.string().uuid().required().messages({
        "any.required": "StorageAddressId é obrigatório",
        "string.empty": "StorageAddressId não pode estar vazio",
        "string.uuid": "StorageAddressId deve ser um UUID válido",
    }),
    quantity: Joi.number().integer().required().messages({
        "any.required": "Quantity é obrigatório",
        "number.base": "Quantity deve ser um número inteiro",
    }),
});

export const deleteProductInventoryValidation = Joi.string().uuid().required();

export const updateProductInventoryValidation = Joi.object({
    productId: Joi.string().uuid().required().messages({
        "any.required": "ProductId é obrigatório",
        "string.empty": "ProductId não pode estar vazio",
        "string.uuid": "ProductId deve ser um UUID válido",
    }),
    storageAddressId: Joi.string().uuid().required().messages({
        "any.required": "StorageAddressId é obrigatório",
        "string.empty": "StorageAddressId não pode estar vazio",
        "string.uuid": "StorageAddressId deve ser um UUID válido",
    }),
    quantity: Joi.number().integer().required().messages({
        "any.required": "Quantity é obrigatório",
        "number.base": "Quantity deve ser um número inteiro",
    }),
});
