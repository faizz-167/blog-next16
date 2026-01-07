import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {authComponent} from "@/convex/auth";

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Must await the auth check
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user || !user._id) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("blog", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });
  },
});

export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blog").order("desc").collect();
    return await Promise.all(
        blogs.map(async (blog) => {
          const resolvedImageUrl = blog.imageStorageId !== undefined
            ? await ctx.storage.getUrl(blog.imageStorageId)
            : null;

          return {
            ...blog,
            imageUrl: resolvedImageUrl,
          };
        })
    )
  },
});

export const generateImageUpload = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getPostById = query({
  args: {
    id: v.id("blog"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get("blog", args.id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const resolvedUrl = blog?.imageStorageId !== undefined
        ? await ctx.storage.getUrl(blog.imageStorageId)
        : null
    return {
      ...blog,
      imageUrl: resolvedUrl,
    }
  }
})