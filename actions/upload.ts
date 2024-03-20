"use server";

import prisma from "@/lib/db";
import { utapi } from "@/server/uploadthing";


export async function deleteImageByUrl(file: string) {
    const response = await utapi.deleteFiles(file);

    if (response.success) {
        return { success: "File deleted successfully!"}
    }

    return { success: "Cannot delete file." };
}