import prisma from '@/lib/db';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({
            error: "Unauthorized",
        }, {
            status: 401
        });
    }

    const logs = await prisma.log.deleteMany({
        where: {
            OR: [
                {
                    occuredAt: {
                        equals: new Date(moment().subtract(30, "days").toISOString())
                    }
                },
                {
                    occuredAt: {
                        lt: new Date(moment().subtract(30, "days").toISOString())
                    }
                }
            ]
        }
    });
    
    return NextResponse.json({ ok: true });
}