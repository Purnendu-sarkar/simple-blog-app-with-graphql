import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { prisma } from './lib/prisma';
import { PrismaClient } from './generated/prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { GlobalOmitConfig } from './generated/prisma/internal/prismaNamespace';
import { jwtHelper } from './utils/jwtHelper';


interface Context {
    prisma: PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs>
}

const main = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req }): Promise<Context> => {
            console.log(req.headers.authorization)

            const userInfo = await jwtHelper.getUserInfoFromToken(req.headers.authorization as string);
            return {
                prisma
            }
        },
    });

    console.log(`🚀  Server ready at: ${url}`);
}

main()