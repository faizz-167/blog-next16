import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {authComponent} from "@/convex/auth";

export const createBlog = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        imageStorageId: v.id("_storage")
    },
    handler: async (ctx, args) => {
        // Must await the auth check
        const user = await authComponent.safeGetAuthUser(ctx);
        if (!user || !user.userId) {
            throw new Error("Not authenticated");
        }

        await ctx.db.insert("blog", {
            title: args.title,
            content: args.content,
            authorId: user.userId,
            imageStorageId: args.imageStorageId
        });
    }
});

export const getBlogs = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("blog").order("desc").collect();
    }
})

export const generateImageUpload = mutation({
    args: {},
    handler: async (ctx) =>{
        const user = await authComponent.getAuthUser(ctx);
        if (!user || !user.userId) {
            throw new Error("Not authenticated");
        }
        return await ctx.storage.generateUploadUrl();
    }
})