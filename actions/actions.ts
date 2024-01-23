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
import { NewDeskSchema } from "@/app/(main)/desks/_components/AddDesk";

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

async function getUserCheckInCount() {
    const checkins = await prisma.booking.count({
        where: {
            OR: [
                {
                    status: BookingStatus.checked_in
                },
                {
                    status: BookingStatus.checked_out
                }
            ]
        }
    });

    revalidatePath("/home");
    
    return checkins;
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
        },
        orderBy: {
            name: "asc"
        }
    });

    const desks = data.map((item) => {
        return {
            id: item.id,
            floor: item.Floor.floor,
            name: item.name,
            coordinates: item.coordinates.map((i) => i.toString()),
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


    await prisma.desk.update({
        where: {
            id
        },
        data: {
            name,
            coordinates: [Number(coord1),Number(coord2),Number(coord3)],
            status: status
        }
    });

    revalidatePath("/desks");
    revalidatePath("/desk");
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
        },
        orderBy: {
            name: "asc"
        }
    })
}

async function getAllFloors() {
    const data = await prisma.floor.findMany({
        orderBy: {
            floor: "asc"
        }
    });

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

async function addFloor(name: string, image: any) {

    const data = await prisma.floor.create({
        // @ts-ignore
        data: {
            floor: name!,
            image: image[0].url
        }
    })

    revalidatePath("/floors");
}

async function mutateFloor(id: string, name: string, image: any) {
    const prev = await prisma.floor.findFirst({
        where: {
            id
        }
    });

    console.log(image);

    if (image) {
        if (prev?.image && prev?.image.includes("https://utfs.io/f/")) {

            const imageF = prev?.image?.split("/")!;
            console.log(imageF);
            await utapi.deleteFiles(imageF[imageF?.length - 1]!);
        }
    }



    if (image) {
        await prisma.floor.update({
            where: {
                id
            },
            // @ts-ignore
            data: {
                image: image[0].url
            }
        })
    }

    await prisma.floor.update({
        where: {
            id
        },
        // @ts-ignore
        data: {
            floor: name!
        }
    })

    

    revalidatePath("/floors");
}

async function addDesk(
    floor: string,
    name: string,
    coord1: string,
    coord2: string,
    coord3: string,
) {
    

    const desk = await prisma.desk.create({
        data: {
            floorId: floor,
            name,
            coordinates: [Number(coord1), Number(coord2), Number(coord3)]
        }
    });

    console.log(desk)

    revalidatePath("/desks");
    revalidatePath("/home");
    revalidatePath("/desk");
}

async function deleteImageByUrl(file: string) {
    const response = await utapi.deleteFiles(file);

    if (response.success) {
        return { success: "File deleted successfully!"}
    }

    return { success: "Cannot delete file." };
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
    const floors = await prisma.floor.findMany({
        orderBy: {
            floor: "asc"
        }
    });

    revalidatePath("/desk");
    return floors;
}
 
async function mutateUser(userId: string, credentials: any) {

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
                        message: eventLogFormats.promoted(`${data?.firstName} ${data?.lastName}`, credentials.role)
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
    const bookings = await prisma.booking.findMany({
        where: {
            status: BookingStatus.checked_in
        },
        include: {
            desk: {
                select: {
                    name: true
                }
            },
        },
        orderBy: {
            startedAt: "asc"
        }
    });

    revalidatePath("/home");

    return bookings;
}

async function recentActivityLogs() {
    const logs = await prisma.log.findMany({
        take: 5,
        orderBy: {
            occuredAt: "desc"
        }
    });

    revalidatePath("/home");
    
    return logs;
}

async function getMonthlyBookings() {
    const bookings = await prisma.booking.findMany({});

    let month1 = bookings.map((item) => {
        if (item.bookedAt.getMonth() == moment().subtract(0, "month").month()) {
            return true;
        }
    });

    let month2 = bookings.map((item) => {
        if (item.bookedAt.getMonth() == moment().subtract(2, "months").month()) {
            return true;
        }
    });


    let month3 = bookings.map((item) => {
        if (item.bookedAt.getMonth() == moment().subtract(3, "months").month()) {
            return true;
        }
    });

    let month4 = bookings.map((item) => {
        if (item.bookedAt.getMonth() == moment().subtract(4, "months").month()) {
            return true;
        }
    });


    month1 = month1.filter((item) => {
        return typeof item != undefined && item;
    });

    month2 = month2.filter((item) => {
        if(typeof item != undefined) return item;
    });

    month3 = month3.filter((item) => {
        if(typeof item != undefined) return item;
    });

    month4 = month4.filter((item) => {
        if(typeof item != undefined) return item;
    });

    revalidatePath("/home");

    return [
        month1,
        month2,
        month3,
        month4,
    ];
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
            status,
        }
    });

    revalidatePath("/bookings");
    revalidatePath("/home");
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


async function getUserUpcomingReservation() {
    const session = await getSession();

    const upReservation = await prisma.booking.findMany({
        where: {
            userId: session?.user.id,
            status: BookingStatus.waiting,
        },
        include: {
            desk: {
                select: {
                    name: true
                }
            }
        }
    });

    revalidatePath("/home");
    return upReservation;
}

// reset password

export {
    getDesks,
    recentActivityLogs,
    getFloors,
    getUserUpcomingReservation,
    getAvailableDesksCount,
    getBookings,
    getAllBookings,
    mutateFloor,
    deleteImageByUrl,
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
    getUserCheckInCount,
    deleteDeskById,
    getAllDesks,
    getMonthlyBookings,
    mutateDesk,
    upcomingBookings,
    addDesk
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