import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: send email reservation reminder before the occuring day
    // TODO: send email reservation reminder on the occuring day
    res.status(200).json({
        message: "Sent Reminders"
    });
}