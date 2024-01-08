import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({
            error: "Unauthorized",
        }, {
            status: 401
        });
    }
    
    console.log("Hello World!");
    return NextResponse.json({ ok: true });
}