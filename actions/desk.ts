"use server"

import prisma from "@/lib/db";
import { DeskStatus } from "@prisma/client";
import z from "zod";
import { revalidatePath } from "next/cache";
import { utapi } from "@/server/uploadthing";

const FormSchema = z.object({
    floor: z.string()
});

export async function getDesks(value: z.infer<typeof FormSchema>) {
    const desks = await prisma.floor.findFirst({
        where: {
            id: value.floor,
            // Desk: {
            //     every: {
            //         Booking: {
            //             some: {
            //                 startedAt: new Date()
            //             }
            //         }
            //     }
            // }
        },
        select: {
            id: true,
            floor: true,
            image: true,
            Desk: {
                select: {
                    id: true,
                    name: true,
                    coordinates: true,
                    status: true,
                    Booking: {
                        select: {
                            bookedAt: true,
                            startedAt: true
                        }
                    }
                }
            }
        }
    });

    
    // console.log(desks);
    // console.log(desks?.Desk[0].coordinates!);

    return desks;
}

export async function checkIfOccupied(deskId: string, bookedAt: Date) {

    const res = await prisma.booking.count({
        where: {
            id: deskId,
            bookedAt
        }
    });

    return res > 0;
}

export async function floorDeskCount(floorId: string) {
    const res = await prisma.desk.count({
        where: {
            floorId
        },

    });

    return res
}

async function occupiedDesks(floorId: string, bookedAt: Date) {}

export async function getAllDesks() {
    const data = await prisma.desk.findMany({
        include: {
            Floor: true
        },
        orderBy: {
            name: "asc"
        }
    });

    const desks = data.map((item) => {
        return {
            id: item.id,
            image: item.image,
            amenities: item.amenities,
            floor: item.Floor.floor,
            name: item.name,
            coordinates: item.coordinates.map((i) => i.toString()),
            status: item.status,
            edit: {
                id: item.id,
                name: item.name,
                coordinates: item.coordinates,
                status: item.status
            },
            delete: item.id
        }
    })
    revalidatePath("/desks");

    return desks;
}

export async function mutateDesk(
    id: string,
    image: string,
    name: string,
    amenities: string[],
    coord1: number,
    coord2: number,
    status: DeskStatus
) {

    const desk = await prisma.desk.findFirst({
        where: {
            id
        }
    });

    if (desk) {
        if (image.length > 0 && desk?.image && desk?.image.includes("https://utfs.io/f/")) {

            const newimage = desk?.image?.split("/")!;
            console.log(image);
            await utapi.deleteFiles(newimage[newimage?.length - 1]!);

            await prisma.desk.update({
                where: {
                    id
                },
                data: {
                    image,
                    name,
                    amenities,
                    coordinates: [Number(coord1),Number(coord2), 10],
                    status: status
                }
            });
        }

        if (image.length == 0) {

            await prisma.desk.update({
                where: {
                    id
                },
                data: {
                    name,
                    amenities,
                    coordinates: [Number(coord1), Number(coord2), 10],
                    status: status
                }
            });
        }
    }



    revalidatePath("/desks");
    revalidatePath("/desk");
}

export async function deleteDeskById(id: string) {
    const data = await prisma.desk.delete({
        where: {
            id
        }
    });

    if (data?.image && data?.image.includes("https://utfs.io/f/")) {

        const image = data?.image?.split("/")!;
        console.log(image);
        await utapi.deleteFiles(image[image?.length - 1]!);
    }

    revalidatePath("/desks");
}

export async function getAvailableDesksCount() {
    return await prisma.desk.count({
        where: {
            status: DeskStatus.available
        },
        orderBy: {
            name: "asc"
        }
    })
}


export async function addDesk(
    image: string,
    floor: string,
    name: string,
    coord1: string,
    coord2: string,
    amenities: string[]
) {
    

    const desk = await prisma.desk.create({
        data: {
            image,
            floorId: floor,
            name,
            coordinates: [Number(coord1), Number(coord2), 10],
            amenities
        }
    });

    console.log(desk)

    revalidatePath("/desks");
    revalidatePath("/home");
    revalidatePath("/desk");
}

export async function getDeskById(id: string, date: Date) {
    const data = await prisma.desk.findFirst({
        where: {
            id
        },
        include: {
            Booking: {
                select: {
                    startedAt: true,
                    bookedAt: true,
                    user: {
                        select: {
                            image: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });

    return data;
}