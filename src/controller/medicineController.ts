import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import { date } from "joi";
import path from "path";
import fs from "fs"
import { rootCertificates } from "tls";
import { ROOT_DIRECTORY } from "../config";

//Create object of prisma
const prisma = new PrismaClient({ errorFormat: "minimal" })
type DrugType = "Syrup" | "Tablet" | "Powder"

const createMedicine = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const stock: number = Number(req.body.stock)
        const exp_date: Date = new Date(req.body.exp_date)
        const price: number = Number(req.body.price)
        const type: DrugType = req.body.type
        const photo: string = req.file?.filename || ``


        // save a new medicine to DB
        const newMedicine = await prisma.medicine.create({
            data: {
                name, stock, exp_date, price, type, photo
            }
        })
        return res.status(200).json({
            message: `New Medicine has been created`,
            data: newMedicine
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}


const readMedicine = async (
    req: Request, res: Response
) => {
    try {
        const search = req.query.search

        // get all medicine 
        const allMedicine = await prisma.medicine.findMany({
            where: {
                OR: [
                    { name: { contains: search?.toString() || "" } }
                ]
            }
        })
        return res.status(200).json({
            message: `medicine has been retrivied`,
            data: allMedicine
        })
    } catch (error) {
        res.status(500).json(error)

    }
}


const updateMedicine = async (req: Request, res: Response) => {
    try {
        // read id medicine that sent at params URL
        const id = req.params.id

        // check existing medicine based on id
        const findMedicine = await prisma.medicine.findFirst({
            where: { id: Number(id) }
        })

        if (!findMedicine) {
            return res.status(200).json({
                message: `Medicine is not found`
            })
        }

        // check change file or not
        if (req.file) {
            //assume that user want to replace photo
            // define the old of filr name
            let oldFileName = findMedicine.photo
            //define path/ location of old file
            let pathFile = `${ROOT_DIRECTORY}/public/medicine-photo/${oldFileName}`
            //check is file exist
            let existFile = fs.existsSync(pathFile)

            if(existFile && oldFileName !== ``){
                fs.unlinkSync(pathFile)
            }
        }

        // Read a property of medicine from req.body
        const { name, stock, price, type, exp_date } = req.body

        // update medicine 
        const saveMedicine = await prisma.medicine.update({
            where: { id: Number(id) }, data: {
                name: name ?? findMedicine.name,
                stock: stock ? Number(stock) : findMedicine.stock,
                price: price ? Number(price) : findMedicine.price,
                exp_date: exp_date ? new Date(exp_date) : findMedicine.exp_date,
                type: type ? type : findMedicine.type,
                photo : req.file ? req.file.filename : findMedicine.photo
            }
        })

        return res.status(200).json({
            message: `Medicine has been updated`,
            data: saveMedicine
        })
    } catch (error) {
        return res.status(500)
            .json(error)

    }
}


const deleteMedicine = async (req: Request, res: Response) => {
    try {
        // read id of medicine from request parameter 
        const id = req.params.id
        // check exsiting medicine 
        const findMedicine = await prisma.medicine.findFirst({
            where: { id: Number(id) }

        })

        if (!findMedicine) {
            return res.status(200).json({
                message: `Medicine is not found`
            })
        }

        // delete the file  
        let oldFileName = findMedicine.photo
        let pathFile = `${ROOT_DIRECTORY}/public/medicine-photo/${oldFileName}`
        let existFile = fs.existsSync(pathFile)

        if (existFile && oldFileName !== ``){
            fs.unlinkSync(pathFile)
        }

        //delete medicine 
        const saveMedicine = await prisma.medicine.delete({ where: { id: Number(id) } })

        return res.status(200).json({
            message: `Medicine has been removed`,
            data: saveMedicine
        })
    } catch (error) {
        return res.status(500).json(error)

    }
}

export { createMedicine, readMedicine, updateMedicine, deleteMedicine }
