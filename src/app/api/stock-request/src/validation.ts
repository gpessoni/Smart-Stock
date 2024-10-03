import Joi from "joi"

export const createStockRequestValidation = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().uuid().required(),
                storageAddressId: Joi.string().uuid().required(),
                quantity: Joi.number().integer().required(),
            })
        )
        .min(1)
        .required(),
})

export const updateStockRequestValidation = Joi.object({
    status: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().uuid().required(),
                storageAddressId: Joi.string().uuid().required(),
                quantity: Joi.number().integer().required(),
            })
        )
        .optional(),
})

export const deleteStockRequestValidation = Joi.string().uuid().required()
