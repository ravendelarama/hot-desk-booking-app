"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { utapi } from "@/server/uploadthing";


export async function getFloors() {
    const floors = await prisma.floor.findMany({
        orderBy: {
            floor: "asc"
        },
        include: {
            _count: {
                select: {
                    Desk: true
                }
            }
        }
    });

    revalidatePath("/desk");
    return floors;
}

export async function getFloorImage(id: string) {
    const data = await prisma.floor.findFirst({
        where: {
            id
        },
        select: {
            image: true
        }
    });

    return data?.image!;
}


// table
export async function getAllFloors() {
    const data = await prisma.floor.findMany({
        orderBy: {
            floor: "asc"
        }
    });

    const floors = data.map((item) => {
        return {
            id: item.id,
            name: item.floor,
            image: item.image,
            edit: {
                id: item.id,
                name: item.floor,
                image: item.image
            },
            delete: item.id
        }
    });

    revalidatePath("/floors");
    return floors;
}

export async function deleteFloorById(id: string) {
    const data = await prisma.floor.delete({
        where: {
            id
        }
    });

    if (data?.image && data?.image.includes("https://utfs.io/f/")) {

        const image = data?.image?.split("/")!;
        console.log(image);
        await utapi.deleteFiles(image[image?.length - 1]!);
    }

    revalidatePath("/floors");
}

export async function addFloor(name: string, image: any) {

    const data = await prisma.floor.create({
        // @ts-ignore
        data: {
            floor: name!,
            image: image!
        }
    })

    revalidatePath("/floors");
}

export async function mutateFloor(id: string, name: string, image: any) {
    const prev = await prisma.floor.findFirst({
        where: {
            id
        }
    });

    console.log(image);

    if (image) {
        if (prev?.image && prev?.image.includes("https://utfs.io/f/")) {

            const imageF = prev?.image?.split("/")!;
            console.log(imageF);
            await utapi.deleteFiles(imageF[imageF?.length - 1]!);
        }
    }



    if (image) {
        await prisma.floor.update({
            where: {
                id
            },
            // @ts-ignore
            data: {
                image: image[0].url
            }
        })
    }

    await prisma.floor.update({
        where: {
            id
        },
        // @ts-ignore
        data: {
            floor: name!
        }
    })

    

    revalidatePath("/floors");
}