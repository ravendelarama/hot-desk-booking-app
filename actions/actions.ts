"use server"

import { getSession } from "@/lib/next-auth"
import z from "zod";
import prisma from "@/lib/db";
import { DeskStatus, Desk, User } from "@prisma/client";
import { Session } from "next-auth";

const FormSchema = z.object({
    floor: z.string(),
    dob: z.date({
      required_error: "Invalid date.",
    }),
});

type Book = Pick<Desk, "id" | "name" | "coordinates" | "status">;

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


async function addBooking(book: Book, date: Date) {
    const session = await getSession();

    if (!session?.user) {
        return {
            message: "UNAUTHORIZED"
        }
    }

    let current = new Date(new Date().toISOString());


    const newBooking = await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            Booking: {
                create: {
                    deskId: book?.id!,
                    startedAt: current,
                    endedAt: current,
                    bookedAt: date
                }
            }
        }
    })
}

async function getDesks(value: z.infer<typeof FormSchema>) {
    // const parsed = FormSchema.safeParse(value);

    // if (!parsed.success) {
        
    //     return {
    //         message: "Validation Failed"
    //     }
    // }

    const desks = await prisma.floor.findUnique({
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


async function getOtherUsers() {
    const session = await getSession();

    // if (!session?.user) {
    //     return {
    //         message: "Session has expired."
    //     }
    // }

    const data = await prisma.user.findMany({
        where: {
            NOT: {
                id: session?.user?.id!
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            image: true
        }
    });

    return data;
}

export {
    getDesks,
    getBookings,
    getFloors,
    addBooking,
    getOtherUsers
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