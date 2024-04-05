import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";
/**
 * This function generates a token for email verification.
 * @param email 
 * @returns {type VerificationToken}
 */
export async function generateVerificationToken(email: string) {
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