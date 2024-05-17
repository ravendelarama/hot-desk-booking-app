import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";
import moment from 'moment';
import nodemailer from "nodemailer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: send email reservation reminder before the occuring day /
    // TODO: send email reservation reminder on the occuring day /
    // TODO: send email reservation approval when admin approves the booking

    // const tomorrowsReservations = await prisma.booking.findMany({
    //     where: {
    //         startedAt: new Date(moment().add(1, "day").toLocaleString())
    //     },
    //     select: {
    //         user: {
    //             select: {
    //                 firstName: true,
    //                 email: true
    //             }
    //         },
    //         desk: {
    //             select: {
    //                 name: true
    //             }
    //         },
    //         startedAt: true,
    //         bookedAt: true
    //     }
    // })
    const config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    }

    
    
    // tomorrowsReservations.map(async (item) => {
    //     const transporter = nodemailer.createTransport(config);

    //     const message = {
    //         from: process.env.NODEMAILER_EMAIL,
    //         to: item.user.email!,
    //         subject: "Hot Desk Booking Reminder",
    //         html: `Hi ${item.user.firstName!}! You reservation on ${item.desk.name} will be available tomorrow!`
    //     }

    //     await transporter.sendMail(message);
    // });

    // const todayReservations = await prisma.booking.findMany({
    //     where: {
    //         startedAt: new Date()
    //     },
    //     select: {
    //         user: {
    //             select: {
    //                 firstName: true,
    //                 email: true
    //             }
    //         },
    //         desk: {
    //             select: {
    //                 name: true
    //             }
    //         },
    //         startedAt: true,
    //         bookedAt: true
    //     }
    // });

    // todayReservations.map(async (item) => {
    //     const transporter = nodemailer.createTransport(config);

    //     const message = {
    //         from: process.env.NODEMAILER_EMAIL,
    //         to: item.user.email!,
    //         subject: "Hot Desk Booking Reminder",
    //         html: `Hi ${item.user.firstName!}! You reservation on ${item.desk.name} is now available! Use is now!`
    //     }

    //     await transporter.sendMail(message);
    // });

    const transporter = nodemailer.createTransport(config);

    const message = {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL,
        subject: "Spot Desk Reminder",
        html: "Reminders Testing"
    }


    await transporter.sendMail(message);

    res.status(200).json({
        message: "Sent Reminders",
        // data: {
        //     reminders: {
        //         todayReservations,
        //         tomorrowsReservations
        //     }
        // },
        occuredAt: new Date().toLocaleString()
    });
}