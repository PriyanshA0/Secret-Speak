"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { addReactionSchema } from "@/lib/validators";
import { requireCurrentUser } from "@/lib/auth";
import ReactionModel from "@/models/Reaction";
import PostModel from "@/models/Post";
import NotificationModel from "@/models/Notification";

export async function addReaction(postId: string, payload: unknown) {
  const user = await requireCurrentUser();
  const parsed = addReactionSchema.parse(payload);

  await connectToDatabase();

  const existing = await ReactionModel.findOne({ post: postId, user: user._id, emoji: parsed.emoji });

  if (!existing) {
    await ReactionModel.create({ post: postId, user: user._id, emoji: parsed.emoji });
    await PostModel.updateOne({ _id: postId }, { $inc: { [`reactions.${parsed.emoji}`]: 1 } });

    const post = await PostModel.findById(postId)
      .populate("author", "clerkId")
      .select("author content")
      .lean();

    const author = (post?.author as { clerkId?: string } | undefined)?.clerkId;
    if (author && author !== user.clerkId) {
      await NotificationModel.create({
        recipientUserId: author,
        type: "reaction",
        postId,
        postSnippet: (post?.content ?? "").slice(0, 40),
      });
    }
  }

  revalidatePath("/");
  revalidatePath(`/post/${postId}`);

  return { ok: true };
}
