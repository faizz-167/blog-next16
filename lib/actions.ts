"use server";

import { api } from "@/convex/_generated/api";
import { fetchAuthMutation, isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/Routes";
import { Id } from "@/convex/_generated/dataModel";

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

  redirect(ROUTES.BLOGS);
};
