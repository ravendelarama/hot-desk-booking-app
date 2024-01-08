import { Role } from "@prisma/client";
import { read } from "fs";
import { withAuth } from "next-auth/middleware";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export { withAuth } from "next-auth/middleware";

function validateRoutes(req: NextRequest, routes: string[]) {
    const isExist = routes.map((item, index, list) => {
        if (req.nextUrl.pathname.endsWith(item)) {
            return true;
        }

        if (index == list.length - 1) {
            return false;
        }
    });

    if (isExist.includes(true)) {
        return true;
    }

    return false;

}

export default withAuth({
    callbacks: {
        authorized: async ({req, token}) => {
            if (!token.isBanned) {
                return false;
            }

            const adminRoutes = [
                '/activity-logs',
                '/desks',
                '/floors',
                '/verification-requests'
            ];

            const managerRoutes = [
                '/desks',
                '/floors'
            ];

            if (token.role === Role.admin) {
                const isValid = validateRoutes(req, adminRoutes);

                return isValid;
            }

            if (token.role === Role.manager) {
                const isValid = validateRoutes(req, managerRoutes);
                
                return isValid;
            }

            return false;
        }
    }
})

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