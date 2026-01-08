import {mutation, query} from "@/convex/_generated/server";
import {ConvexError, v} from "convex/values";
import {authComponent} from "@/convex/auth";

export const getCommentsByPost = query({
    args: { blogId: v.id("blog") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("comments")
            .filter((q) => q.eq(q.field('blogId'), args.blogId))
            .order("desc")
            .collect();
    }
})

export const createComment = mutation({
    args: {
        blogId: v.id("blog"),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);
        if (!user || !user._id) {
            throw new ConvexError("Not authenticated");
        }
        return await ctx.db.insert("comments", {
            authorId: user._id,
            authorName: user.name,
            blogId: args.blogId,
            body: args.body,
        })
    }
})