import { prisma } from "../lib/prisma";

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
            //console.log(args)
            return context.prisma.user.create({
                data: args
            });
        }
    }
};