import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { jwtHelper } from "../utils/jwtHelper";

interface userInfo {
    name: string,
    email: string,
    password: string,
}


export const resolvers = {
    Query: {
        users: async (parent: any, args: any, context: any) => {
            return await prisma.user.findMany();
        }
    },
    Mutation: {
        signup: async (parent: any, args: userInfo, context: any) => {
            const isExist = await prisma.user.findFirst({
                where: {
                    email: args.email
                }
            })

            if (isExist) {
                return {
                    userError: "Already this email is Registered!",
                    token: null
                }
            }

            const hashedPassword = await bcrypt.hash(args.password, 12)
            //console.log(hashedPassword)
            //console.log(args)
            const newUser = await context.prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    password: hashedPassword
                }
            });

            const token = await jwtHelper({ userID: newUser.id });
            //console.log(token)
            return {
                userError: null,
                token: token,
            }
        },

        signin: async (parent: any, args: any, context: any) => {
            console.log(args)

            const user = await prisma.user.findFirst({
                where: {
                    email: args.email
                }
            })

            //console.log(user)

            if (!user) {
                return {
                    userError: "User Not Found!",
                    token: null
                }
            }

            const correctPass = await bcrypt.compare(args.password, user.password);
            //console.log(correctPass)

            if (!correctPass) {
                return {
                    userError: "Incorrect Password!",
                    token: null
                }
            }

            const token = await jwtHelper({ userID: user.id });
            return {
                userError: null,
                token: token,
            }
        }
    }
};