import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";
/**
 * This function generates a token for email verification.
 * @param email 
 * @returns {type VerificationToken}
 */
export async function generateVerificationToken(email: string | null | undefined) {
    
    if (!email) {
        return null;
    }
    
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await prisma.verificationToken.findFirst({
        where: {
            email
        }
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expiredAt: expires
        }
    });
    
    return verificationToken;
}

export async function generateMFAVerificationToken(email: string | null | undefined, password: string | null | undefined) {
    
    if (!email || !password) {
        return null;
    }
    
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await prisma.mFAVerificationToken.findFirst({
        where: {
            email,
        }
    });

    if (existingToken) {
        await prisma.mFAVerificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const mFAVerificationToken = await prisma.mFAVerificationToken.create({
        data: {
            email,
            password,
            token,
            expiredAt: expires
        }
    });
    
    return mFAVerificationToken;
}

export async function generateResetPasswordToken(email: string | null | undefined) {

    if (!email) {
        return null;
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await prisma.resetPasswordToken.findFirst({
        where: {
            email
        }
    });

    if (existingToken) {
        await prisma.resetPasswordToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const resetPasswordToken = await prisma.resetPasswordToken.create({
        data: {
            email,
            token,
            expiredAt: expires
        }
    });
    
    return resetPasswordToken;
}