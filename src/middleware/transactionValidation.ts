import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const detailSchema = Joi.object({
    medicine_id: Joi.number().required(),
    qty: Joi.number().required().min(1)
})
const createSchema = Joi.object({
    cashier_name: Joi.string().required(),
    order_date: Joi.date().required(),
    transaction_detail: Joi
    .array()
    .items(detailSchema)
    .min(1)
    .required()
})

const createValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = createSchema.validate(req.body)
    if (validate.error) {
        // 400: Bad request
        return res.status(400).json({
            message: validate
                .error
                .details
                .map(item => item.message)
                .join()
        })
    }
    next()
}

export {createValidation}