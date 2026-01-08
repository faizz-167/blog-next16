import z from "zod";
import {Id} from "@/convex/_generated/dataModel";

export const commentSchema = z.object({
    body: z.string().min(1).max(1000),
    blogId: z.custom<Id<"blog">>()
})