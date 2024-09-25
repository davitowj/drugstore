import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { error, log } from "console";
import path from "path";
import fs from "fs"
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";


const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nama: string = req.body.nama
        const email: string = req.body.email
        const password: string = req.body.password
        const findEmail = await prisma.admin.findFirst({ where: { email }})

        if (findEmail){
            return res.status(400).json({message: `Email already exist`})
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const admin = await prisma.admin.create({
            data: {
                nama,
                email,
                password: hashPassword,
            }
        })

        return res.status(200).json({
            message: "Admin created successfully",
            data: admin,
        })
    } catch (error) {
        res.status(500)
        .json(error)
    }
};

const readAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = await prisma.admin.findMany();

        return res.status(200).json({
            message: "Admins retrieved successfully",
            data: admin,
        })
    } catch (error) {
        res.status(500)
        .json(error)
    }
}

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const nama: string = req.body.nama
        const email: string = req.body.email
        const password: string = req.body.password

        const findAdmin = await prisma.admin.findFirst({
            where: { id: Number(id) }
        })

        if (!findAdmin) {
            return res.status(200).json({
                message: `Medicine is not found`
            })
        }

        const admin = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
            nama: nama ? nama: findAdmin.nama,
            email: email ? email: findAdmin.email,
            password: password? await bcrypt.hash(password, 12): findAdmin.password
            }
        });

        return res.status(200).json({
            message: "Admin updated successfully",
            data: admin
        });
    } catch (error) {
        res.status(500)
        .json(error)
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await prisma.admin.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "Admin deleted successfully",
        });
    } catch (error) {
        res.status(500)
        .json(error)
    }
};


//make function for log in
const authentication = async (req: Request, res: Response) => {
 try {
    const {email, password} = req.body

    // check  existing email
    const findAdmin = await prisma.admin.findFirst({
        where: {email}
    })

    if(!findAdmin){
        return res.status(200).json({message: `Email is not registered`})
    }

    const isMatchPassword = await bcrypt.compare(password, findAdmin.password)

    if (!isMatchPassword){
        return res.status(200).json({message: `invallid password`})
    }

    //prepare to generate token using jwt

    const payload = {
        nama: findAdmin.nama,
        email: findAdmin.email
    }

    const signature = process.env.SECRET || ``

    const token = Jwt.sign(payload, signature)

    return res.status(200).json({logged: true,
        token,
        id: findAdmin.id,
        nama: findAdmin.nama,
        email: findAdmin.email})

 } catch (error) {
    return res
    .status(500)
    .json(error)
      
 }
}

export {createAdmin, updateAdmin, deleteAdmin,readAdmin, authentication}