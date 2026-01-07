"use server";

import {api} from "@/convex/_generated/api";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/Routes";
import {fetchAuthMutation} from "@/lib/auth-server";
import {Id} from "@/convex/_generated/dataModel";

interface Props {
    title: string,
    content: string,
    imageStorageId: Id<"_storage">
}

export const createBlogAction = async (data: Props) => {
    // Now this payload is very small and won't trigger the 413 error
    await fetchAuthMutation(api.blogs.createBlog, {
        title: data.title,
        content: data.content,
        imageStorageId: data.imageStorageId,
    });

    redirect(ROUTES.BLOGS);
};
