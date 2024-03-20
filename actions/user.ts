"use server";

import prisma from "@/lib/db";
import { EventType } from "@prisma/client";
import { getSession } from "@/lib/next-auth";
import { eventLogFormats } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { utapi } from "@/server/uploadthing";


export async function getOtherUsers() {
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


export async function getAllUserCount() {
    return prisma.user.count()
}


export async function loginUser(userId: string, firstName: string, lastName: string) {

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

    revalidatePath("/activity-logs");
}

export async function logoutUser() {
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

export async function deleteUserById(email: string) {
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


export async function mutateUser(userId: string, credentials: any) {

    const data = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            // firstName: credentials.firstName,
            // lastName: credentials.lastName,
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

// TODO: Reset Password

// TODO: Email Verification