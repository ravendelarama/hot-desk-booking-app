import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";
import moment from 'moment';
import nodemailer from "nodemailer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: send email reservation reminder before the occuring day /
    // TODO: send email reservation reminder on the occuring day /
    // TODO: send email reservation approval when admin approves the booking

    const tomorrowsReservations = await prisma.booking.findMany({
        where: {
            startedAt: moment().add(1, "day").toDate()
        },
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

    for (var i = 0; i < tomorrowsReservations.length; i++) {

        const message = {
            from: process.env.NODEMAILER_EMAIL,
            to: tomorrowsReservations[i].user.email!,
            subject: "Spot Desk Booking Reminder",
            html: `Hi ${tomorrowsReservations[i].user.firstName!}! You reservation on ${tomorrowsReservations[i].desk.name} will be available tomorrow!`
        }


        await transporter.sendMail(message);
    }


    const todaysReservations = await prisma.booking.findMany({
        where: {
            startedAt: moment().toDate()
        },
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

    for (var i = 0; i < todaysReservations.length; i++) {

        const message = {
            from: process.env.NODEMAILER_EMAIL,
            to: todaysReservations[i].user.email!,
            subject: "Spot Desk Booking Reminder",
            html: `Hi ${todaysReservations[i].user.firstName!}! You reservation on ${todaysReservations[i].desk.name} is now available!`
        }


        await transporter.sendMail(message);
    }

    res.status(200).json({
        message: "Sent Reminders",
        data: {
            reminders: {
                todaysReservations,
                tomorrowsReservations
            }
        },
        occuredAt: new Date().toLocaleString()
    });
}