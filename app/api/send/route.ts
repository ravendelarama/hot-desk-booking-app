import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(request: Request) {
    const { email, token } = await request.json();

    const config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    }
    const transporter = nodemailer.createTransport(config);

    const message = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Verification Email",
        html: `<a href="https://spot-desk.vercel.app/verify?token=${token?.token}">Confirm here</a>`
    }

    try {

        const result = await transporter.sendMail(message);
        
        return NextResponse.json({
            result: result.accepted
        })
    } catch (error) {
        return NextResponse.json({error})
    }
}
