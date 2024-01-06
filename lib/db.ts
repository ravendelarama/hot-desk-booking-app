import { PrismaClient, Role } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

export const eventLogFormats = {
    registered: (user: string) => `${user} has been registered.`,
    verified: (userId: string) => `${userId} has been verified.`,
    signed_in: (user: string) => `${user} has signed in.`,
    signed_out: (user: string) => `${user} has signed out.`,
    booked: (user: string, deskId: string) => `${user} made a reservation on desk ${deskId}.`,
    canceled: (userId: string, bookId: string) => `${userId} canceled reservation ${bookId}.`,
    checked_in: (user: string, bookId: string) => `${user} has checked in.`,
    checked_out: (user: string, bookId: string) => `${user} has checked out.`,
    promoted: (user: string, role: Role) => `${user} has been promoted to ${role}`,
    delete_user: (userId: string) => `${userId} has been deleted.`,
    reset_password: (userId: string) => `password reset by ${userId}.`,
    update_user: () => "User updated successfully."
}