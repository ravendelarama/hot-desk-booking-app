"use server"

import { getSession } from "@/lib/next-auth"
import z from "zod";
import prisma from "@/lib/db";
import { DeskStatus } from "@prisma/client";
import { Session } from "next-auth";

const FormSchema = z.object({
    floor: z.string(),
    dob: z.date({
      required_error: "Invalid date.",
    }),
});

async function getBookings() {
    const session = await getSession();
    

    const data = await prisma.booking.findMany({
        where: {
            userId: session?.user.id!
        },
        include: {
            desk: true
        }
    });

    return data;
}


async function addBooking() {
    const session = await getSession();

    if (!session?.user) {
        return {
            message: "UNAUTHORIZED"
        }
    }

    // await prisma.booking.create({
    //     data: {
    //         deskId: "654fb47b6b85b672200e695a" as string,
    //         userId: session.user.id as string,
    //     }
    // })
}

async function getDesks(value: z.infer<typeof FormSchema>) {
    // const parsed = FormSchema.safeParse(value);

    // if (!parsed.success) {
        
    //     return {
    //         message: "Validation Failed"
    //     }
    // }

    const desks = await prisma.floor.findMany({
        where: {
            floor: value.floor
        },
        select: {
            id: true,
            floor: true,
            image: true,
            Desk: {
                select: {
                    id: true,
                    name: true,
                    coordinates: true,
                    status: true,
                    Booking: {
                        select: {
                            bookedAt: true
                        }
                    }
                }
            }
        }
    });

    return desks;
}

async function getFloors() {
    return await prisma.floor.findMany();
}


export {
    getDesks,
    getBookings
}


/**
 * ACTIONS:
 * getDesks
 * getDeskById
 * getAvailableDesks
 * getDisabledDesks
 * getBookings
 * getBookingById
 * addBooking
 * addDesk
 * deleteBooking
 * editBookingById
 * editDeskById
 * editUserById
 * getUsers
 * getUserById
 * deleteUserById
 */