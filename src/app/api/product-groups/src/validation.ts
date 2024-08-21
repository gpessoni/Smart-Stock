import Joi from "joi"

export const createGroupsValidation = Joi.object({
    code: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least {#limit} characters",
        "string.max": "Name must have at most {#limit} characters",
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least {#limit} characters",
        "string.max": "Name must have at most {#limit} characters",
    }),
})

export const deleteGroupsValidation = Joi.string().uuid().required();

export const updateGroupsValidation = Joi.object({
    code: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least {#limit} characters",
        "string.max": "Name must have at most {#limit} characters",
    }),
    description: Joi.string().trim().min(2).max(100).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least {#limit} characters",
        "string.max": "Name must have at most {#limit} characters",
    }),
})
