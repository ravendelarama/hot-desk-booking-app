import nodemailer from "nodemailer";
import z from "zod";
import { User } from "@prisma/client";
import prisma from "./db";
import jwt from "jsonwebtoken";

type Prop = Pick<User, "id" | "email" | "firstName" | "lastName"> & {
    token: string;
}

const schema = z.object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    token: z.string()
})

export async function verifyEmail({ id, email, firstName, lastName, token }: Prop) {
    const parsed = schema.safeParse({
        id,
        email,
        firstName,
        lastName,
        token
    });

    if (!parsed.success) return false;

    const config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    }
    const transporter = nodemailer.createTransport(config)

    const message = {
        from: process.env.NODEMAILER_EMAIL,
        to: email!,
        subject: "Email Verification Testing",
        html: `<h1>Hello ${firstName} ${lastName}!</h1>`
    }


    try {

        
        const verifyToken = await prisma.verificationToken.findUnique({
            where: {
                token: token
            }
        });

        if (!verifyToken) {

            const now = new Date();
            const expiration = new Date((new Date(now.getFullYear(), now.getMonth(), now.setDate(now.getDate() + 1))).toISOString())

            const createToken = await prisma.verificationToken.create({
                data: {
                    identifier: "",
                    token: token,
                    expires: expiration
                }
            });

            // const isValid = jwt.verify()
            return true;
        }

        const result = await transporter.sendMail(message);
        return true;
    } catch (error) {
        return false;
    }
}
