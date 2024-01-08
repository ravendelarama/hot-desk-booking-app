import { DefaultSession } from "next-auth";
import { Role, User } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user?: Omit<User, "password" | "createdAt" | "updatedAt", "emailVerified">
    }

    interface Profile {
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
        image?: string;
    }
}

declare module "next-auth/jwt" {
    type JWT = Omit<User, "password" | "createdAt" | "updatedAt", "emailVerified">
}