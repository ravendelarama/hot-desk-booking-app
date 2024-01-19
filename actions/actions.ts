"use server"

import { getSession } from "@/lib/next-auth"
import z from "zod";
import prisma from "@/lib/db";
import { DeskStatus, Desk, User, EventType, BookingStatus, Role } from "@prisma/client";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { eventLogFormats } from "@/lib/db";
import moment from "moment";
import { utapi } from "@/server/uploadthing";
import { DesksFormSchema } from "@/app/(main)/desks/_components/UpdateRow";

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

async function getAllBookings() {
    const data = await prisma.booking.findMany({
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
            bookedAt: item.bookedAt,
            edit: {
                id: item.id,
                status: item.status
            },
            delete: item.id
        }
    });

    revalidatePath("/bookings");
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

async function getAllDesks() {
    const data = await prisma.desk.findMany({
        include: {
            Floor: true
        }
    });

    const desks = data.map((item) => {
        return {
            id: item.id,
            floor: item.Floor.floor,
            name: item.name,
            coordinates: item.coordinates,
            status: item.status,
            edit: {
                id: item.id,
                name: item.name,
                coordinates: item.coordinates,
                status: item.status
            },
            delete: item.id
        }
    })
    revalidatePath("/desks");

    return desks;
}

async function mutateDesk(
    id: string,
    name: string,
    coord1: number,
    coord2: number,
    coord3: number,
    status: DeskStatus
) {

    let arr = [coord1,coord2,coord3]

    await prisma.desk.update({
        where: {
            id
        },
        data: {
            name,
            coordinates: arr,
            status: status
        }
    });

    revalidatePath("/desks");
}

async function deleteDeskById(id: string) {
    await prisma.desk.delete({
        where: {
            id
        }
    });

    revalidatePath("/desks");
}

async function getAvailableDesksCount() {
    return await prisma.desk.count({
        where: {
            status: DeskStatus.available
        }
    })
}

async function getAllFloors() {
    const data = await prisma.floor.findMany();

    const floors = data.map((item) => {
        return {
            id: item.id,
            name: item.floor,
            image: item.image,
            edit: {
                id: item.id,
                name: item.floor,
                image: item.image
            },
            delete: item.id
        }
    });

    revalidatePath("/floors");
    return floors;
}

async function deleteFloorById(id: string) {
    const data = await prisma.floor.delete({
        where: {
            id
        }
    });

    if (data?.image && data?.image.includes("https://utfs.io/f/")) {

        const image = data?.image?.split("/")!;
        console.log(image);
        await utapi.deleteFiles(image[image?.length - 1]!);
    }

    revalidatePath("/floors");
}

async function addFloor(name: string, image: File) {
    
    const uploaded = await utapi.uploadFiles(image)

    const data = await prisma.floor.create({
        // @ts-ignore
        data: {
            floor: name!,
            image: uploaded.data?.url!
        }
    })

    revalidatePath("/floors");
}

async function mutateFloor(id: string, name: string, image: File) {
    const prev = await prisma.floor.findFirst({
        where: {
            id
        }
    });

    if (prev?.image && prev?.image.includes("https://utfs.io/f/")) {

        const image = prev?.image?.split("/")!;
        console.log(image);
        await utapi.deleteFiles(image[image?.length - 1]!);
    }

    const uploaded = await utapi.uploadFiles(image)

    await prisma.floor.update({
        where: {
            id
        },
        // @ts-ignore
        data: {
            floor: name!,
            image: uploaded.data?.url!
        }
    })

    revalidatePath("/floors");
}

async function addDesk() {

}


async function getOtherUsers() {
    const session = await getSession();


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

    const user = await prisma.user.delete({
            where: {
                email
            }
    });

    if (user?.image && user?.image.includes("https://utfs.io/f/")) {

        const image = user.image?.split("/")!;
        console.log(image);
        await utapi.deleteFiles(image[image?.length - 1]!);
    }
    

    revalidatePath("/employees");
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

async function getFloors() {
    return await prisma.floor.findMany();
}
 
async function mutateUser(userId: string, credentials: any) {
    const session = await getSession();

    const data = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            isBanned: credentials.isBanned,
            Log: {
                create: {
                    activity: EventType.update_user,
                    message: eventLogFormats.update_user()
                }
            }
        }
    });

    if (credentials.role != data.role) {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: credentials.role,
                Log: {
                    create: {
                        activity: EventType.promoted,
                        message: eventLogFormats.promoted(`${session?.user?.firstName} ${session?.user.lastName}`, credentials.role)
                    },
                }
            }
        });
    }
    
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
            occuredAt: item.occuredAt,
            delete: item.id
        }
    });
    
    return logs;
}

async function upcomingBookings() {
    return await prisma.booking.count({
        where: {
            status: BookingStatus.checked_in
        },
        select: {
            userId: true
        }
    });
}

async function deleteBookingById(id: string) {
    await prisma.booking.delete({
        where: {
            id
        }
    });

    revalidatePath("/bookings");

}

async function mutateBooking(id: string, status: string) {
    await prisma.booking.update({
        where: {
            id
        },
        data: {
            // @ts-ignore
            status
        }
    });

    revalidatePath("/bookings");
}

async function deleteActivityLogById(id: string) {
    await prisma.log.delete({
        where: {
            id
        }
    });

    revalidatePath("/activity-logs");
}

async function deleteAllActivityLogs() {
    await prisma.log.deleteMany();

    revalidatePath("/activity-logs");
}

// reset password

export {
    getDesks,
    getFloors,
    getAvailableDesksCount,
    getBookings,
    getAllBookings,
    mutateFloor,
    getAllFloors,
    deleteFloorById,
    addFloor,
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
    deleteBookingById,
    deleteUserById,
    mutateBooking,
    getActivityLogs,
    deleteActivityLogById,
    deleteAllActivityLogs,
    deleteDeskById,
    getAllDesks,
    mutateDesk
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