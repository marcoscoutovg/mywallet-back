import joi from "joi";

export const operationSchema = joi.object({
    value: joi.number().positive().required(),
    description: joi.string().min(5).required()
})