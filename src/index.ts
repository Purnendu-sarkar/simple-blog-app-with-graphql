import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { prisma } from './lib/prisma';
import { PrismaClient } from './generated/prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { GlobalOmitConfig } from './generated/prisma/internal/prismaNamespace';


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
        context: async (): Promise<Context> => {
            return {
                prisma
            }
        },
    });

    console.log(`🚀  Server ready at: ${url}`);
}

main()