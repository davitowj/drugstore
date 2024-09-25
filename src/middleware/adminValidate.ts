import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";
import path from "path";
import { ROOT_DIRECTORY } from "../config";
import fs from "fs"

const createScheme = Joi.object({
    nama: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const createValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = createScheme.validate(req.body)
    if (validate.error) {
        //delete current uploaded file
        let fileName: string = req.file?.filename || ""
        let pathFile = path.join(ROOT_DIRECTORY, "public", "admin-photo", fileName)
        //cek eksistensi
        let fileExists = fs.existsSync(pathFile)
        // apakah ad file yang akan dihapus
        if (fileExists && fileName !== "") {
            //maka kita hapus
            fs.unlinkSync(pathFile)
        }
        return res.status(400)
            .json({
                message: validate.error.details.map(it => it.message).join()
            })
    }
    next()
}

const updateScheme = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const updateValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = updateScheme.validate(req.body)
    if (validate.error) {
        //delete current uploaded file
        let fileName: string = req.file?.filename || ""
        let pathFile = path.join(ROOT_DIRECTORY, "public", "admin-photo", fileName)
        //cek eksistensi
        let fileExists = fs.existsSync(pathFile)
        // apakah ad file yang akan dihapus
        if (fileExists && fileName !== "") {
            //maka kita hapus
            fs.unlinkSync(pathFile)
        }
        return res.status(400)
            .json({
                message: validate.error.details.map(it => it.message).join()
            })
    }
    next()
}


const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const authValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = authSchema.validate(req.body)
    if (validate.error) {
        //delete current uploaded file
        let fileName: string = req.file?.filename || ""
        let pathFile = path.join(ROOT_DIRECTORY, "public", "admin-photo", fileName)
        //cek eksistensi
        let fileExists = fs.existsSync(pathFile)
        // apakah ad file yang akan dihapus
        if (fileExists && fileName !== "") {
            //maka kita hapus
            fs.unlinkSync(pathFile)
        }
        return res.status(400)
            .json({
                message: validate.error.details.map(it => it.message).join()
            })
    }
    next()
}

export { createValidation, updateValidation, authValidation }