"use server";

import prisma from "@/lib/db";
import { BookingStatus, EventType, Desk } from "@prisma/client";
import { getSession } from "@/lib/next-auth";
import { eventLogFormats } from "@/lib/db";
import { revalidatePath } from "next/cache";
import moment from "moment";


type Book = Pick<Desk, "id" | "name" | "coordinates" | "status">;


export async function getBookings() {
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

export async function getAllBookings() {
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

export async function getUserBookingCount() {
    const session = await getSession();

    return await prisma.booking.count({
        where: {
            userId: session?.user.id!
        }
    })
}

export async function getAllBookingCount() {
    return await prisma.booking.count()
}

export async function addBooking(desk: Desk, date: Date) {
    const session = await getSession();

    if (!session?.user) {
        return {
            message: "UNAUTHORIZED"
        }
    }
    console.log(date.getDate())

    let current = new Date((new Date()).toISOString());


    await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            Booking: {
                create: {
                    deskId: desk?.id!,
                    startedAt: date,
                    endedAt: date,
                    bookedAt: current
                }
            },
            Log: {
                create: {
                    activity: EventType.booked,
                    message: eventLogFormats.booked(`${session?.user?.firstName} ${session?.user?.lastName}`, desk?.name!)
                }
            }
        },
        include: {
            Booking: true
        }
    })

    console.log("created!")

    revalidatePath("/bookings");
}


export async function cancelBooking(bookId: string) {
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


export async function getMonthlyBookings() {
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


export async function mutateBooking(id: string, status: string) {
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


/**
 * An action that returns the upcoming bookings
 * @returns {type Booking}
 */
export async function upcomingBookings() {
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


export async function deleteBookingById(id: string) {
    await prisma.booking.delete({
        where: {
            id
        }
    });

    revalidatePath("/bookings");

}

export async function getUserUpcomingReservation() {
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


export async function checkIn(bookId: string) {
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

export async function checkOut(bookId: string) {
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


export async function getUserCheckInCount() {
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