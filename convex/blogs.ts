import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {authComponent} from "@/convex/auth";
import {Doc, Id} from "@/convex/_generated/dataModel";

interface SearchPostResult {
    _id: Id<'blog'>
    title: string
    content: string
}

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

    return await ctx.db.insert("blog", {
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

export const searchPost = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit
    const result: SearchPostResult[] = [];
    const seen = new Set()

    const pushDocs = async (docs: Array<Doc<'blog'>>) => {
      for (const doc of docs) {
        if (seen.has(doc._id))continue;
        seen.add(doc._id);
        result.push({
          _id: doc._id,
          title: doc.title,
          content: doc.content
        });
        if (result.length >= limit) break;
      }
    }

    const searchTitles = await ctx.db
        .query("blog")
        .withSearchIndex(
            "search_title",
            (q) => q.search("title", args.term))
        .take(limit)

    await pushDocs(searchTitles)
    if (result.length < limit) {
      const contentMatches = await ctx.db
          .query("blog")
          .withSearchIndex(
              "search_content",
              (q) => q.search("content", args.term))
          .take(limit)
      await pushDocs(contentMatches)
    }
    return result
  }
})