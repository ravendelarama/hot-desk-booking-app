"use server"

import { getSession } from "@/lib/next-auth"
import z from "zod";
import prisma from "@/lib/db";
import { DeskStatus, Desk, User, EventType, BookingStatus, Role } from "@prisma/client";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { eventLogFormats } from "@/lib/db";

const FormSchema = z.object({
    floor: z.string()
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

async function getUserBookingCount() {
    const session = await getSession();

    return await prisma.booking.count({
        where: {
            userId: session?.user.id!
        }
    })
}


async function getAllBookings() {
    return await prisma.booking.findMany()
}

async function getAllBookingCount() {
    return await prisma.booking.count()
}


async function addBooking(book: Book, date: Date) {
    const session = await getSession();

    if (!session?.user) {
        return {
            message: "UNAUTHORIZED"
        }
    }
    console.log(date.getDate())

    let current = new Date(new Date().toISOString());


    const newBooking = await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            Booking: {
                create: {
                    deskId: book?.id!,
                    startedAt: date,
                    endedAt: current,
                    bookedAt: current
                }
            },
            Log: {
                create: {
                    activity: EventType.booked,
                    message: eventLogFormats.booked(`${session?.user?.firstName} ${session?.user?.lastName}`, book?.name!)
                }
            }
        },
        include: {
            Booking: true
        }
    })

    revalidatePath("/bookings")
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

async function getAllUserCount() {
    return prisma.user.count()
}

async function loginUser(userId: string, firstName: string, lastName: string) {

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            Log: {
                create: {
                    activity: EventType.signed_in,
                    message: eventLogFormats.signed_in(`${firstName} ${lastName}`)
                }
            }
        }
    });
}

async function logoutUser() {
    const session = await getSession();

    if (session?.user) {
        await prisma.user.update({
            where: {
                id: session?.user?.id!
            },
            data: {
                Log: {
                    create: {
                        activity: EventType.signed_out,
                        message: eventLogFormats.signed_out(`${session?.user?.firstName} ${session?.user?.lastName}`)
                    }
                }
            }
        });
    }
}

async function cancelBooking(bookId: string) {
    const session = await getSession();

    await prisma.booking.update({
        where: {
            userId: session?.user?.id,
            id: bookId
        },
        data: {
            status: BookingStatus.canceled
        }
    });

    revalidatePath("/bookings");
}

async function checkIn(bookId: string) {
    const session = await getSession();

    await prisma.booking.update({
        where: {
            id: bookId
        },
        data: {
            status: BookingStatus.checked_in,
            user: {
                update: {
                    Log: {
                        create: {
                            activity: EventType.checked_in,
                            message: eventLogFormats.checked_in(
                                `${session?.user?.firstName} ${session?.user?.lastName}`,
                                bookId
                            )
                        }
                    }
                }
            }
        }
    });
    
    revalidatePath("/bookings");
}

async function checkOut(bookId: string) {
    const session = await getSession();

    await prisma.booking.update({
        where: {
            id: bookId
        },
        data: {
            status: BookingStatus.checked_out,
            user: {
                update: {
                    Log: {
                        create: {
                            activity: EventType.checked_in,
                            message: eventLogFormats.checked_out(
                                `${session?.user?.firstName} ${session?.user?.lastName}`,
                                bookId
                            )
                        }
                    }
                }
            }
        }
    });
    
    revalidatePath("/bookings");
}

async function promoteUser(userId: string, role: Role) {
    const session = await getSession();

    if (session?.user.role === Role.admin) {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role,
                Log: {
                    create: {
                        activity: EventType.promoted,
                        message: eventLogFormats.promoted(`${session?.user?.firstName} ${session?.user.lastName}`, role)
                    }
                }
            }
        });
        session.user.role = role;

        revalidatePath("/employees");
    }

    return {
        message: "Permission Denied."
    }
}

async function deleteUserById(userId: string, role: Role) {
    const session = await getSession();

    if (session?.user?.role === Role.admin && role != Role.admin) {
        await prisma.user.delete({
            where: {
                id: userId,
                role
            }
        });
    }

    revalidatePath("/employees");
}

async function getActivityLogs() {
    return await prisma.log.findMany();
}

// reset password

export {
    getDesks,
    getBookings,
    getFloors,
    addBooking,
    getOtherUsers,
    getAllBookingCount,
    getUserBookingCount,
    getAllUserCount,
    loginUser,
    logoutUser,
    cancelBooking,
    checkIn,
    checkOut,
    promoteUser,
    deleteUserById,
    getActivityLogs
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