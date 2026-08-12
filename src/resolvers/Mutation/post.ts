import { checkUserAccess } from "../../utils/checkUserAccess";

export const postResolvers = {
    addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
        // console.log("Add Post Data:", args)
        // console.log("User Info:", userInfo);

        if (!userInfo) {
            return {
                userError: "User not authenticated!",
                post: null
            }
        }

        if (!post.title || !post.content) {
            return {
                userError: "Title and Content are required!",
                post: null
            }
        }

        const newPost = await prisma.post.create({
            data: {
                title: post.title,
                content: post.content,
                authorId: userInfo.userId
            }
        });
        // console.log(newPost);

        return {
            userError: null,
            post: newPost
        }
    },
    updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
        // console.log("args", args, "User Info", userInfo);

        if (!userInfo) {
            return {
                userError: "User not authenticated!",
                post: null
            }
        }

        const error = await checkUserAccess(prisma, userInfo.userId, args.postId);
        if (error) {
            return error;
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: Number(args.postId)
            },
            data: args.post
        });

        return {
            userError: null,
            post: updatedPost
        }
    },

    
    deletePost: async (parent: any, args: any, { prisma, userInfo }: any) => {

        if (!userInfo) {
            return {
                userError: "User not authenticated!",
                post: null
            }
        }

        const error = await checkUserAccess(prisma, userInfo.userId, args.postId);
        if (error) {
            return error;
        }

        const deletePost = await prisma.post.delete({
            where: {
                id: Number(args.postId)
            },
            data: args.post
        });

        return {
            userError: null,
            post: deletePost
        }
    }
}