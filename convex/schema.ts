import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    blog: defineTable({
        title: v.string(),
        content: v.string(),
        authorId: v.string(),
        imageStorageId: v.optional(v.id("_storage"))
    }).searchIndex('search_title',{
        searchField: 'title'
    }).searchIndex('search_content',{
        searchField: 'content'
    }),
    comments: defineTable({
        blogId: v.id("blog"),
        authorId: v.string(),
        authorName: v.string(),
        body: v.string(),
    })
});