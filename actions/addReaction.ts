"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { reactionSchema } from "@/lib/validators";
import { requireCurrentUser } from "@/lib/auth";
import ReactionModel from "@/models/Reaction";
import PostModel from "@/models/Post";
import NotificationModel from "@/models/Notification";

export async function addReaction(postId: string, payload: unknown) {
  const user = await requireCurrentUser();
  const parsed = reactionSchema.parse(payload);

  await connectToDatabase();

  const targetType = "post";
  const targetId = postId;

  const existing = await ReactionModel.findOne({ userId: user._id, targetType, targetId });

  if (existing && existing.emoji === parsed.emoji) {
    await existing.deleteOne();
    if (targetType === "post") {
      await PostModel.updateOne({ _id: targetId }, { $inc: { [`reactionCounts.${parsed.emoji}`]: -1 } } as any);
    }
  } else if (existing && existing.emoji !== parsed.emoji) {
    const prev = existing.emoji;
    existing.emoji = parsed.emoji;
    await existing.save();
    if (targetType === "post") {
      await PostModel.updateOne({ _id: targetId }, { $inc: { [`reactionCounts.${parsed.emoji}`]: 1, [`reactionCounts.${prev}`]: -1 } } as any);
    }
  } else {
    await ReactionModel.create({ userId: user._id, targetType, targetId, emoji: parsed.emoji });
    if (targetType === "post") {
      await PostModel.updateOne({ _id: targetId }, { $inc: { [`reactionCounts.${parsed.emoji}`]: 1 } } as any);

      const post = await PostModel.findById(targetId).populate("authorId", "clerkId").select("authorId content").lean();
      const author = (post?.authorId as { clerkId?: string } | undefined)?.clerkId;
      if (author && author !== user.clerkId) {
        await NotificationModel.create({
          recipientUserId: author,
          type: "reaction",
          postId: targetId,
          postSnippet: (post?.content ?? "").slice(0, 40),
        });
      }
    }
  }

  revalidatePath("/");
  revalidatePath(`/post/${postId}`);

  return { ok: true };
}
