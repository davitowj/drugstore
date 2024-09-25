import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import path from "path"
import fs from "fs"
import { ROOT_DIRECTORY } from "../config"

// Create a ruke/schema for add new medicine
const createScheme = Joi.object({
    name: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    price: Joi.number().min(1).required(),
    exp_date: Joi.date().required(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").required()
})

const createValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = createScheme.validate(req.body)
    if (validate.error) {
        // delete currwnt uploaded file
        let fileName = req.file?.filename || ``
        let pathFile = path.join(ROOT_DIRECTORY, "public", "medicine-photo", fileName)
        //apakah ada file yang akan dihapus
        let fileExist = fs.existsSync(pathFile)

        if (fileExist && fileName !== ``) {
            // delete file
            fs.unlinkSync(pathFile)
        }
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

// Create a rule/schema for change new medicine
const updateScheme = Joi.object({
    name: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    price: Joi.number().min(1).optional(),
    exp_date: Joi.date().optional(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").optional()
})

const updateValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = updateScheme.validate(req.body)
    if (validate.error) {
         // delete currwnt uploaded file
         let fileName = req.file?.filename || ``
         let pathFile = path.join(ROOT_DIRECTORY, "public", "medicine-photo", fileName)
         //apakah ada file yang akan dihapus
         let fileExist = fs.existsSync(pathFile)
 
         if (fileExist && fileName !== ``) {
             // delete file
             fs.unlinkSync(pathFile)
         }
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

export { createValidation, updateValidation }