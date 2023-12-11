import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
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
        to: "official.ravendelarama@gmail.com",
        subject: "Email Testing",
        html: "<h1>Hello world!</h1>"
    }


    try {

        const result = await transporter.sendMail(message);
        return NextResponse.json({
            result
        })
    } catch (error) {
        return NextResponse.json({error})
    }
}
