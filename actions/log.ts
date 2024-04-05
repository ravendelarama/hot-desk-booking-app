"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";


export async function getActivityLogs() {
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


export async function recentActivityLogs() {
    const logs = await prisma.log.findMany({
        take: 5,
        orderBy: {
            occuredAt: "desc"
        }
    });

    revalidatePath("/");
    
    return logs;
}




export async function deleteActivityLogById(id: string) {
    await prisma.log.delete({
        where: {
            id
        }
    });

    revalidatePath("/activity-logs");
}

export async function deleteAllActivityLogs() {
    await prisma.log.deleteMany();

    revalidatePath("/activity-logs");
}