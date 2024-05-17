import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const { token } = req.nextauth;

        if (pathname?.split("/")?.includes("api")!) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (
            token?.role == Role.user && 
            [
                "/floors",
                "/employees",
                "/desks",
                "/verification-requests",
                "/activity-logs"
            ].includes(pathname)
        ) {
            return NextResponse.redirect(new URL("/", req.url))
        }

        if (
            token?.role == Role.manager &&
            [
                "/verification-requests",
                "/activity-logs",
                "/employees",
            ].includes(pathname)
        ) {
            return NextResponse.redirect(new URL("/home", req.url))
        }
    }, {
    callbacks: {
        authorized: async ({ req, token }) => {
            return !!token;
        }
        
    }
});

export const config = {
    matcher: [
        '/',
        '/bookings',
        '/desk',
        '/home',
        '/employees',
        '/activity-logs',
        '/desks',
        '/floors',
        '/profile-upload',
        '/verification-requests'
    ]
}