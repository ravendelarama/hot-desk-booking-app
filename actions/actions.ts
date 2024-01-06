"use server"

import { getSession } from "@/lib/next-auth"
import z from "zod";
import prisma from "@/lib/db";
import { DeskStatus, Desk, User, EventType, BookingStatus, Role } from "@prisma/client";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { eventLogFormats } from "@/lib/db";
import moment from "moment";


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
            user: true,
            desk: true
        }
    });

    const bookings = data.reverse().map((item) => {
        return {
            id: item.id,
            user: item.user,
            desk: item.desk,
            status: item.status,
            occuredAt: item.startedAt,
            bookedAt: item.bookedAt
        }
    });

    return bookings;
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

    let current = new Date((new Date()).toISOString());


    const newBooking = await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            Booking: {
                create: {
                    deskId: book?.id!,
                    startedAt: date,
                    endedAt: date,
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

async function addFloors(userId: string, image: string) {
    const session = await getSession();

    if (session?.user?.id === userId && session?.user?.role === Role.admin) {
        
    }
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
            image: true,
            isBanned: true
        }
    });

    const users = data.map((item) => {
        return {
            image: item.image,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            isBanned: item.isBanned,
            role: item.role,
            edit: item,
            delete: item.email
        }
    });

    return users;
}

async function getAllUserCount() {
    return prisma.user.count()
}

async function loginUser(userId: string, firstName: string, lastName: string) {

    const data = await prisma.user.update({
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

    revalidatePath("/activity-logs");
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

    revalidatePath("/activity-logs");
}

async function deleteUserById(email: string) {
    const session = await getSession();

    console.log(email)

    if (session?.user && session.user.role === Role.admin) {
        await prisma.user.delete({
            where: {
                email
            }
        });
    }

    revalidatePath("/employees");
    return {
        message: "User has been deleted successfully."
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
            status: BookingStatus.canceled,
            user: {
                update: {
                    Log: {
                        create: {
                            activity: EventType.canceled,
                            message: eventLogFormats.canceled(`${session?.user.firstName} ${session?.user?.lastName}`, bookId)
                        }
                    }
                }
            }
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
 
async function mutateUser(userId: string, credentials: any) {
    const session = await getSession();

    const EventLogs = [
        {
            activity: EventType.promoted,
            message: eventLogFormats.promoted(`${session?.user?.firstName} ${session?.user.lastName}`, credentials.role)
        },
        {
            activity: EventType.update_user,
            message: eventLogFormats.update_user()
        }
    ];

    const data = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...credentials,
            Log: {
                create: EventLogs 
            }
        }
    });
    
    revalidatePath("/employees");
}


async function getActivityLogs() {
    const data = await prisma.log.findMany({
        include: {
            User: true
        }
    });

    const logs = data.reverse().map((item) => {
        return {
            id: item.id,
            user: item.User,
            activity: item.activity,
            message: item.message,
            occuredAt: item.occuredAt
        }
    });
    
    return logs;
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
    mutateUser,
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