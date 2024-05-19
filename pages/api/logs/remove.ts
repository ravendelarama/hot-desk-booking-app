import type { NextApiRequest, NextApiResponse } from 'next'
import moment from "moment"
import prisma from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await prisma.log.deleteMany({
        where: {
            occuredAt: moment().subtract(30, "days").toDate()
        }
    });

    res.status(200).json({
        message: "30 Logs cleared."
    })
}
