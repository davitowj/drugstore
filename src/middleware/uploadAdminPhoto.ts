import multer, { Multer } from "multer";
import { Request } from "express";
import { ROOT_DIRECTORY } from "../config";
import { File } from "buffer";
//mendefinisikan storage ke save upload file

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void
    ) => {
        const storagePath = '${ROOT_DIRECTORY}/public/admin-photo/'
        callback(null, storagePath)
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void
    ) => {
        const fileName = '${Math.random()}-${file.originalname}'
        callback(null, fileName)
    }
})
//define function to filter file 
const filterFile = (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
) => {
    //define allowed extension
    const allowedFile = /png|jpg|jpeg|gif/
    //cek ekstensi dari uploadfile
    const isAllow = allowedFile.test(file.mimetype)

    if (isAllow) {
        callback(null, true)
    } else {
        callback(new Error(`your file is not allow to upload`))
    }
}

const uploadAdminPhoto = multer({
    storage: storage,
    fileFilter: filterFile,
    limits: { fileSize: 2 * 1024 * 1024 }//2 mb
})

export { uploadAdminPhoto }