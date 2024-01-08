import { BookingStatus } from '@prisma/client';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({
            error: "Unauthorized",
        }, {
            status: 401
        });
    }
    
    const books = await prisma.booking.updateMany({
        where: {
            status: BookingStatus.checked_in,
        },
        data: {
            status: BookingStatus.checked_out
        }
    });

    return NextResponse.json({ ok: true });
}