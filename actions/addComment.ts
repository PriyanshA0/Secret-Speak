"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { createCommentSchema } from "@/lib/validators";
import { sanitizeAndFilterText } from "@/lib/post-helpers";
import { requireCurrentUser } from "@/lib/auth";
import CommentModel from "@/models/Comment";
import PostModel from "@/models/Post";
import NotificationModel from "@/models/Notification";

export async function addComment(postId: string, payload: unknown) {
  const user = await requireCurrentUser();
  const parsed = createCommentSchema.parse(payload);

  await connectToDatabase();

  const comment = await CommentModel.create({
    postId,
    authorId: user._id,
    content: sanitizeAndFilterText(parsed.content),
    parentCommentId: parsed.parentCommentId ?? null,
  });

  await PostModel.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });

  const post = await PostModel.findById(postId).populate("authorId", "clerkId").select("authorId content").lean();

  const author = (post?.authorId as { clerkId?: string } | undefined)?.clerkId;
  if (author && author !== user.clerkId) {
    await NotificationModel.create({
      recipientUserId: author,
      type: "comment",
      postId,
      postSnippet: (post?.content ?? "").slice(0, 40),
    });
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath("/");

  return { ok: true, id: String(comment._id) };
}
