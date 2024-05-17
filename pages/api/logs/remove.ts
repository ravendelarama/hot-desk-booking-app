import type { NextApiRequest, NextApiResponse } from 'next'
import moment from "moment"
import prisma from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    

    res.status(200).json({
        message: "Logs cleared."
    })
}
