import { getServerSession } from "next-auth/next";
import prisma, {eventLogFormats} from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { EventType, Role, User } from "@prisma/client";
import z from "zod";
import { loginUser } from "@/actions/actions";
import { randomUUID } from "crypto";
import moment from "moment";
import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import { verifyEmail } from "./email";


const credentialSchema = z.object({
    email: z.string().email({
        message: "Email must be valid."
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    }).max(50, {
        message: "Password must not be above 50 characters."
    })
})

export const AuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            async profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    image: profile.picture
                }
            }
        }),
        CredentialsProvider({
            id: "credential-login",
            name: "login",
            credentials: {
                email: {
                    label: "Email",
                    type: "text"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            async authorize(credentials: any) {
                    if (!credentials || !credentials.email || !credentials.password) {
                        throw new Error("Invalid credentials");
                    }

                    const isValid = credentialSchema.safeParse(credentials);

                    if (!isValid.success) throw new Error("Invalid Credentials");

                    const user = credentials;
                    
                    const data = await prisma.user.findUnique({
                        where: {
                            email: user.email
                        }
                    });

                    if (!data) {
                        throw new Error("Invalid Credentials");
                    }
                
                    if (data.isBanned) {
                        throw new Error("Permission Denied");
                    }

                    const hash = await bcrypt.compare(user.password, data.password as string);
                    
                    if (!hash) throw new Error("Invalid Credentials");
                    
                    
                    return {
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        image: data.image,
                        role: data.role
                    };
                }
        }),
        CredentialsProvider({
            id: "credential-register",
            name: "register",
            credentials: {
                firstName: {
                    label: "First Name",
                    type: "text"
                },
                lastName: {
                    label: "Last Name",
                    type: "text"
                },
                email: {
                    label: "Email",
                    type: "text"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            async authorize(credentials: any) {
                    if (!credentials || !credentials.firstName || !credentials.lastName || !credentials.email || !credentials.password) {
                        throw new Error("Invalid credentials");
                    }

                    const isValid = credentialSchema.safeParse(credentials);

                    if (!isValid.success) throw new Error("Invalid Credentials");

                    const user = credentials;
    
                    const newPass = await bcrypt.hash(user.password, 10);

                    if (!newPass) throw new Error("Invalid Credentials");

                    const data = await prisma.user.create({
                        data: {
                            image: user.image,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            password: newPass,
                            Log: {
                                create: {
                                    activity: EventType.registered,
                                    message: eventLogFormats.registered(`${user.firstName} ${user.lastName}`)
                                }
                            }
                        }
                    });

                    if (!data) throw new Error("Invalid Credentials");

                    const hash = await bcrypt.compare(user.password, data.password as string);

                    if (!hash) throw new Error("Invalid Credentials");
                    
                    await prisma.user.update({
                        where: {
                            id: data?.id
                        },
                        data: {
                            Log: {
                                create: {
                                    activity: EventType.signed_in,
                                    message: eventLogFormats.signed_in(`${data?.firstName} ${data?.lastName}`)
                                }
                            }
                        }
                    });
                
                    return {
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        image: data.image,
                        role: data.role,
                        isBanned: data.isBanned
                    };
                }
        })
    ],
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ account, profile }) {
            // return profile!.email!.endsWith("@student.laverdad.edu.ph");
            if (account?.provider === "google") {
                const user = await prisma.user.findUnique({
                    where: {
                        email: profile?.email
                    },
                });

                if (user?.isBanned) {
                    throw new Error("Permission Denied");
                }
                
                if (user) {
                    await prisma.log.create({
                        data: {
                            userId: user?.id!, 
                            activity: EventType.signed_in,
                            message: eventLogFormats.signed_in(`${user?.firstName} ${user?.lastName}`)
                        }
                    });
                }
                
            }
            return true;
        },
        async jwt({ token, user }) {
            
            if (user) {
                let u = user as User;
                token.id = u.id;
                token.firstName = u.firstName;
                token.lastName = u.lastName;
                token.email = u.email;
                token.role = u.role;
                token.isBanned = u.isBanned;
            }
            return token;
        },
        //  @ts-ignore
        async session({ session, token }) {
            let data = {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    email: token.email,
                    role: token.role,
                    isBanned: token.isBanned
                }
            }
            
            const isExist = await prisma.user.findUnique({
                where: {
                    id: token.id
                }
            });

            if (!isExist) {
                return null;
            }

            return data;
        }
    },
    pages: {
        signIn: '/signin',
        error: '/auth/error',
    }
}

export const getSession = async () => await getServerSession(AuthOptions);

export function validateRoutes(req: NextRequest, routes: string[]) {
    const isValid = routes.map((item, index, list) => {
        if (req.nextUrl.pathname === item || index === list.length - 1) {
            return false;
        }
    });

    if (!isValid.includes(false)) {
        return true;
    }

    return false;
}