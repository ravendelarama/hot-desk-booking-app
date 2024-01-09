import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
// import { validateRoutes } from "./lib/next-auth";

export default withAuth({
    callbacks: {
        authorized: async ({ req, token }) => {
            if (token) {
                if (token.isBanned) return false;
                
                if (token.role == Role.admin) return true;
                
                let path = req.nextUrl.pathname;

                if (token.role == Role.manager) {
                
                    if (!path.endsWith("activity-logs") ||
                        !path.endsWith("verification-requests")
                    ) {
                        return true;
                    }
                }

                if (token.role == Role.user) {
                
                    if (
                        !path.endsWith("activity-logs") ||
                        !path.endsWith("verification-requests") ||
                        !path.endsWith("floors") ||
                        !path.endsWith("desks")
                    ) {
                        return true;
                    }
                }
            }
            return false;
        }
        
    }
});

// export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        '/',
        '/bookings',
        '/desk',
        '/home',
        '/employees',
        '/faq',
        '/activity-logs',
        '/desks',
        '/floors',
        '/profile-upload'
    ]
}