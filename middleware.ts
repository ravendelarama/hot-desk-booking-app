export { default } from "next-auth/middleware";

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