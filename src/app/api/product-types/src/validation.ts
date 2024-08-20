import Joi from "joi"

export const createTypesValidation = Joi.object({
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least {#limit} characters",
        "string.max": "Name must have at most {#limit} characters",
    }),
})

export const deleteTypesValidation = Joi.string().uuid().required();

export const updateTypesValidation = Joi.object({
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least {#limit} characters",
        "string.max": "Name must have at most {#limit} characters",
    }),
})
