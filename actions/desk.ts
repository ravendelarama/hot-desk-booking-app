"use server"

import prisma from "@/lib/db";
import { DeskStatus } from "@prisma/client";
import z from "zod";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
    floor: z.string()
});

export async function getDesks(value: z.infer<typeof FormSchema>) {
    const desks = await prisma.floor.findUnique({
        where: {
            floor: value.floor
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
                            bookedAt: true
                        }
                    }
                }
            }
        }
    });

    return desks;
}

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
    name: string,
    coord1: number,
    coord2: number,
    coord3: number,
    status: DeskStatus
) {


    await prisma.desk.update({
        where: {
            id
        },
        data: {
            name,
            coordinates: [Number(coord1),Number(coord2),Number(coord3)],
            status: status
        }
    });

    revalidatePath("/desks");
    revalidatePath("/desk");
}

export async function deleteDeskById(id: string) {
    await prisma.desk.delete({
        where: {
            id
        }
    });

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
    floor: string,
    name: string,
    coord1: string,
    coord2: string,
    coord3: string,
) {
    

    const desk = await prisma.desk.create({
        data: {
            floorId: floor,
            name,
            coordinates: [Number(coord1), Number(coord2), Number(coord3)]
        }
    });

    console.log(desk)

    revalidatePath("/desks");
    revalidatePath("/home");
    revalidatePath("/desk");
}