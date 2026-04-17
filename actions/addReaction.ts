"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { addReactionSchema } from "@/lib/validators";
import { requireCurrentUser } from "@/lib/auth";
import ReactionModel from "@/models/Reaction";
import PostModel from "@/models/Post";

export async function addReaction(postId: string, payload: unknown) {
  const user = await requireCurrentUser();
  const parsed = addReactionSchema.parse(payload);

  await connectToDatabase();

  const existing = await ReactionModel.findOne({ post: postId, user: user._id, emoji: parsed.emoji });

  if (!existing) {
    await ReactionModel.create({ post: postId, user: user._id, emoji: parsed.emoji });
    await PostModel.updateOne({ _id: postId }, { $inc: { [`reactions.${parsed.emoji}`]: 1 } });
  }

  revalidatePath("/");
  revalidatePath(`/post/${postId}`);

  return { ok: true };
}
