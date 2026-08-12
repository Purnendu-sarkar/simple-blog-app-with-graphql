export const postResolvers = {
    addPost: async (parent: any, {post}: any, { prisma, userInfo }: any) => {
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
    }
}