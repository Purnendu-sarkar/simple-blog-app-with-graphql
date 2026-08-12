import bcrypt from 'bcrypt';
import { jwtHelper } from '../../utils/jwtHelper';
import config from '../../config';

interface userInfo {
    name: string,
    email: string,
    password: string,
    bio?: string
}


export const Mutation = {
    signup: async (parent: any, args: userInfo, { prisma }: any) => {
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
        const newUser = await prisma.user.create({
            data: {
                name: args.name,
                email: args.email,
                password: hashedPassword
            }
        });

        if (args.bio) {
            await prisma.profile.create({
                data: {
                    bio: args.bio,
                    userId: newUser.id
                }
            })
        }

        const token = await jwtHelper.generateToken({ userId: newUser.id }, config.jwt.secret as string);
        //console.log(token)
        return {
            userError: null,
            token: token,
        }
    },

    signin: async (parent: any, args: any, { prisma }: any) => {
        // console.log(args)

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

        const token = await jwtHelper.generateToken({ userId: user.id }, config.jwt.secret as string);
        return {
            userError: null,
            token: token,
        }
    },

    addPost: async (parent: any, args: any, { prisma, userInfo }: any) => {
        // console.log("Add Post Data:", args)
        console.log("User Info:", userInfo);

        if (!userInfo) {
            return {
                userError: "User not authenticated!",
                post: null
            }
        }

        if (!args.title || !args.content) {
            return {
                userError: "Title and Content are required!",
                post: null
            }
        }

        const newPost = await prisma.post.create({
            data: {
                title: args.title,
                content: args.content,
                authorId: userInfo.userId
            }
        });
        console.log(newPost);

        return {
            userError: null,
            post: newPost
        }
    }
}