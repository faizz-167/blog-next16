"use server";

import {api} from "@/convex/_generated/api";
import {fetchAuthMutation, isAuthenticated} from "@/lib/auth-server";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/Routes";
import {Id} from "@/convex/_generated/dataModel";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";

interface Props {
  title: string;
  content: string;
  imageStorageId?: Id<"_storage">;
}

export const createBlogAction = async (payload: Props) => {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect(ROUTES.SIGN_IN);
  }

  const { title, content, imageStorageId } = payload;
  if (!title || !content) {
    throw new Error("title and content required");
  }

  await fetchAuthMutation(api.blogs.createBlog, {
    title,
    content,
    imageStorageId: imageStorageId,
  });
  revalidatePath(ROUTES.BLOGS);  // revalidate the blogs page based on demand
  return redirect(ROUTES.BLOGS);
};
