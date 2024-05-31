import nodemailer from "nodemailer";
import { getServerSession } from "next-auth/next";
import prisma, {eventLogFormats} from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { EventType } from "@prisma/client";
import z from "zod";
import { generateMFAVerificationToken, generateVerificationToken } from "./token";
import { redirect } from "next/navigation";
import { randomInt } from "crypto";
import moment from "moment";



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
                
                    console.log("input valid")
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
                    console.log("email not exist")
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
                
                    console.log("auth test.");
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
    events: {
        linkAccount: async ({user}) => {
            await prisma.user.update({
                where: {
                    email: user.email!
                },
                data: {
                    emailVerified: new Date()
                }
            });
        }
    },
    callbacks: {
        // @ts-ignore
        async signIn({ account, profile, user }) {
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
                    await prisma.user.update({
                        where: {
                            id: user?.id
                        },
                        data: {
                            authenticated: true
                        }
                    })
                    await prisma.log.create({
                        data: {
                            userId: user?.id!,
                            activity: EventType.signed_in,
                            message: eventLogFormats.signed_in(`${user?.firstName} ${user?.lastName}`)
                        }
                    });
                }
                return true
                
            }

            
            if (user?.email) {
                const verifyUser = await prisma.user.findFirst({
                    where: {
                        email: user?.email
                    }
                });

                
                const config = {
                    service: "gmail",
                    auth: {
                        user: process.env.NODEMAILER_EMAIL,
                        pass: process.env.NODEMAILER_PASSWORD
                    }
                }
                const transporter = nodemailer.createTransport(config);
            

                if (!verifyUser?.emailVerified) {
                    const token = await generateVerificationToken(user?.email!);
                    const message = {
                        from: process.env.NODEMAILER_EMAIL,
                        to: user?.email!,
                        subject: "Verification Email",
                        html: `<a href="https://spot-desk.vercel.app/verify?token=${token?.token}">Click here to verify.</a>`
                    }

                    await transporter.sendMail(message);
                    return false;
                }

            

                //MFA soon...
                if (verifyUser?.mfaEnabled && !verifyUser?.authenticated) {
                    const token = await generateMFAVerificationToken(user?.email!);
                    const message = {
                        from: process.env.NODEMAILER_EMAIL,
                        to: user?.email!,
                        subject: "Multi Factor Authentication Verification Email",
                        html: `<a href="https://spot-desk.vercel.app/auth?token=${token?.token}">Click here to verify.</a>`
                    }

                    await transporter.sendMail(message);
                    return false;
                }

                return true;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                const data = await prisma.user.findFirst({
                    where: {
                        id: user.id
                    }
                });
            

                if (data) {
                    token.id = data.id;
                    token.firstName = data.firstName;
                    token.lastName = data.lastName;
                    token.email = data.email;
                    token.role = data.role;
                    token.isBanned = data.isBanned;
                    token.mfaEnabled = data.mfaEnabled;
                }
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
                    isBanned: token.isBanned,
                    mfaEnabled: token.mfaEnabled
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