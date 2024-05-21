"use server";

import prisma from "@/lib/db";
import { EventType } from "@prisma/client";
import { getSession } from "@/lib/next-auth";
import { eventLogFormats } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { utapi } from "@/server/uploadthing";
import { redirect } from "next/navigation";
import { generateResetPasswordToken } from "@/lib/token";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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

export async function sendResetToken(email: string) {
    const isOAuth = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            _count: {
                select: {
                    accounts: true
                }
            }
        }
    });

    if (isOAuth?._count.accounts! > 0 || !email) {
        return {
            message: "Invalid email."
        }
    }

    const token = await generateResetPasswordToken(email!);
    
    if (!token) {
        return {
            message: "Invalid email."
        }
    }

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
        to: email!,
        subject: "Reset Password",
        html: `<a href="https://spot-desk.vercel.app/reset?token=${token?.token}">Click here to reset your password.</a>`
    }

    await transporter.sendMail(message);

    revalidatePath("/signin");
    redirect("/signin");
}

export async function resetPassword(token: string, newPassword: string) {
    const resetToken = await prisma.resetPasswordToken.findFirst({
        where: {
            token
        }
    });

    if (!resetToken || !resetToken?.email) {
        return {
            message: "Invalid Token."
        }
    }

    const isOAuth = await prisma.user.findUnique({
        where: {
            email: resetToken.email!
        },
        include: {
            _count: {
                select: {
                    accounts: true
                }
            }
        }
    });

    if (isOAuth?._count.accounts! > 0) {
        return {
            message: "Invalid email."
        }
    }


    if (new Date() >= resetToken.expiredAt) {
        return {
            message: "Token expired."
        }
    }

    await prisma.resetPasswordToken.delete({
        where: {
            id: resetToken.id
        }
    });

    const hash = await bcrypt.hash(newPassword, 10);
    
    if (!hash) {
        return {
            message: "Invalid credentials."
        }
    }

    await prisma.user.update({
        where: {
            email: resetToken.email!
        },
        data: {
            password: hash
        }
    });
    
    revalidatePath("/signin");
    redirect("/signin");
}

export async function verifyEmail(token: string) {
    const requestToken = await prisma.verificationToken.findFirst({
        where: {
            token
        }
    });

    if (!requestToken || !requestToken.email) {
        return {
            message: "Invalid Token."
        }
    }

    if (new Date() >= requestToken.expiredAt) {
        return {
            message: "Token expired."
        }
    }

    await prisma.verificationToken.delete({
        where: {
            id: requestToken.id
        }
    });

    await prisma.user.update({
        where: {
            email: requestToken.email
        },
        data: {
            emailVerified: new Date()
        }
    });

    revalidatePath("/signin");
    redirect("/signin");
}

export async function updateName(firstName: string, lastName:string) {
    const session = await getSession();

    await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            firstName,
            lastName,
        }
    });

    revalidatePath("/settings/account");
}

export async function updateAvatar(image: string) {
    const session = await getSession();


    const user = await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        }
    });

    if(!user) {
        return {
            message: "Unauthorized"
        }
    }

    if (user?.image && user?.image?.length > 0) {

        if (user?.image.includes("https://utfs.io/f/")) {
            const oldAvatar = user?.image?.split("/")!;
            await utapi.deleteFiles(oldAvatar[oldAvatar?.length - 1]!);
        }
    }

    await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            image
        }
    });

    revalidatePath("/settings/account");
}

export async function changePass(newPassword: string) {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        },
        include: {
            accounts: {
                select: {
                    type: true,
                    provider: true
                }
            }
        }
    });

    console.log(user?.accounts);

    // TODO

}

export async function getAvatar() {
    const session = await getSession();

    return await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        },
        select: {
            image: true
        }
    });
}

export async function getCurrentUser() {
    const session = await getSession();

    return await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        }
    })
}

export async function setReservationReminders(isEnabled: boolean) {
    const session = await getSession();

    await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            notifyReminders: isEnabled,
        }
    });

    revalidatePath("/settings/notification");
}