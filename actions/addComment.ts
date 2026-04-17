"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { addCommentSchema } from "@/lib/validators";
import { sanitizeAndFilterText } from "@/lib/post-helpers";
import { requireCurrentUser } from "@/lib/auth";
import CommentModel from "@/models/Comment";
import PostModel from "@/models/Post";

export async function addComment(postId: string, payload: unknown) {
  const user = await requireCurrentUser();
  const parsed = addCommentSchema.parse(payload);

  await connectToDatabase();

  const comment = await CommentModel.create({
    post: postId,
    author: user._id,
    content: sanitizeAndFilterText(parsed.content),
    parentComment: parsed.parentCommentId ?? null,
  });

  await PostModel.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });

  revalidatePath(`/post/${postId}`);
  revalidatePath("/");

  return { ok: true, id: String(comment._id) };
}
