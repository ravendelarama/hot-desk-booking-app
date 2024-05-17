import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";
import moment from 'moment';
import nodemailer from "nodemailer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: send email reservation reminder before the occuring day /
    // TODO: send email reservation reminder on the occuring day /
    // TODO: send email reservation approval when admin approves the booking

    const reservations = await prisma.booking.findMany({
        select: {
            user: {
                select: {
                    firstName: true,
                    email: true
                }
            },
            desk: {
                select: {
                    name: true
                }
            },
            startedAt: true,
            bookedAt: true
        }
    });

    const config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    }
    
    const transporter = nodemailer.createTransport(config);

    for (var i = 0; i < reservations.length; i++) {

        if (moment().date() + 1 == reservations[i].startedAt.getDate()) {
            const message = {
                from: process.env.NODEMAILER_EMAIL,
                to: reservations[i].user.email!,
                subject: "Spot Desk Booking Reminder",
                html: `Hi ${reservations[i].user.firstName!}! You reservation on ${reservations[i].desk.name} will be available tomorrow!`
            }
    
    
            await transporter.sendMail(message);
        }
    }


    for (var i = 0; i < reservations.length; i++) {

        if (moment().date() == reservations[i].startedAt.getDate()) {
            const message = {
                from: process.env.NODEMAILER_EMAIL,
                to: reservations[i].user.email!,
                subject: "Spot Desk Booking Reminder",
                html: `Hi ${reservations[i].user.firstName!}! You reservation on ${reservations[i].desk.name} is now available!`
            }
    
    
            await transporter.sendMail(message);
        }
    }

    res.status(200).json({
        message: "Sent Reminders",
        data: {
            reminders: {
                reservations,
            }
        },
        occuredAt: new Date().toLocaleString()
    });
}