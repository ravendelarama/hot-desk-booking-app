"use server";

import prisma from "@/lib/db";
import { EventType, Desk, Role, ApprovalType } from "@prisma/client";
import { getSession } from "@/lib/next-auth";
import { eventLogFormats } from "@/lib/db";
import { revalidatePath } from "next/cache";
import moment from "moment";
import nodemailer from "nodemailer"


type Book = Pick<Desk, "id" | "name" | "coordinates">;


export async function getBookings() {
    const session = await getSession();
    

    const data = await prisma.booking.findMany({
        where: {
            userId: session?.user.id!
        },
        include: {
            desk: {
                select: {
                    name: true,
                    Floor: true
                }
            }
        }
    });

    const bookings = data.reverse().map((item) => {
        return {
            id: item.id,
            desk: item.desk,
            occuredAt: item.startedAt,
            bookedAt: item.bookedAt,
            approved: item.approved,
            canceled: item.canceled
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
            occuredAt: item.startedAt,
            bookedAt: item.bookedAt,
            approved: item.approved,
            edit: {
                id: item.id,
                approved: item.approved
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

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        }
    });


    const result = await prisma.user.update({
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
                },
            },
            Log: {
                create: {
                    activity: EventType.booked,
                    message: eventLogFormats.booked(`${session?.user?.firstName} ${session?.user?.lastName}`, desk?.name!)
                }
            }
        },
        include: {
            Booking: {
                include: {
                    desk: true
                }
            }
        }
    });

    const approval = await prisma.approval.findFirst();

    console.log(approval);

    if (approval && approval.type == ApprovalType.auto) {
        const updated = await prisma.booking.update({
            where: {
                id: result.Booking[result.Booking.length - 1].id
            },
            data: {
                approved: true
            }
        });

        console.log(updated);

        if (user && user.notifyReminders!) {
            const config = {
                service: "gmail",
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD
                }
            }
    
            const transporter = nodemailer.createTransport(config);
    
            const message = {
                from: process.env.NODEMAILER_EMAIL,
                to: result.email!,
                subject: "Spot Desk Booking Reminder",
                html: `Your reservation at ${result.Booking[result.Booking.length - 1]?.desk.name} on ${result.Booking[result.Booking.length - 1]?.startedAt.toLocaleDateString()} has been approved!`
            }
    
            await transporter.sendMail(message);
        }
    }

    

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
            canceled: true,
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


export async function mutateBooking(id: string, reminders: boolean) {
    await prisma.booking.update({
        where: {
            id
        },
        data: {
            // @ts-ignore
            notifyReminders: reminders,
        }
    });

    revalidatePath("/bookings");
    revalidatePath("/home");
}


export async function deleteBookingById(id: string) {
    await prisma.booking.delete({
        where: {
            id
        }
    });

    revalidatePath("/bookings");

}

export async function checkIfAutoApprove() {
    const isAutoApproved = await prisma.approval.findFirst();
    console.log(isAutoApproved);
    return isAutoApproved?.type == ApprovalType.auto;
}

export async function autoApprove(approved: ApprovalType) {
    const session = await getSession();

    if (session?.user?.role == Role.user) {
        return {
            message: "Forbidden"
        }
    }

    const approval = await prisma.approval.findFirst();

    if (!approval) {
        await prisma.approval.create({
            data: {
                type: approved
            }
        });
    }

    if (approval) {
        await prisma.approval.update({
            where: {
                id: approval.id
            },
            data: {
                type: approved
            }
        });
    }

    revalidatePath("/bookings");
}

export async function approveBooking(id: string) {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user.id
        }
    });

    const book = await prisma.booking.update({
        where: {
            id
        },
        data: {
            approved: true
        },
        include: {
            user: true,
            desk: true
        }
    });

    if (user && user.notifyReminders!) {
        const config = {
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        }

        const transporter = nodemailer.createTransport(config);

        const message = {
            from: process.env.NODEMAILER_EMAIL,
            to: book.user.email!,
            subject: "Spot Desk Booking Reminder",
            html: `Your reservation at ${book.desk.name} on ${book.startedAt.toLocaleDateString()} has been approved!`
        }

        await transporter.sendMail(message);
    }

    revalidatePath("/bookings");
}

// export async function getUserUpcomingReservation() {
//     const session = await getSession();

//     const upReservation = await prisma.booking.findMany({
//         where: {
//             userId: session?.user.id,
//         },
//         include: {
//             desk: {
//                 select: {
//                     name: true
//                 }
//             }
//         }
//     });

//     revalidatePath("/home");
//     return upReservation;
// }