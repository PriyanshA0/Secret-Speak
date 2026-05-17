"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { sanitizeAndFilterText } from "@/lib/post-helpers";
import { createPostSchema } from "@/lib/validators";
import { requireCurrentUser } from "@/lib/auth";
import PostModel from "@/models/Post";

export async function createPost(payload: unknown) {
  const user = await requireCurrentUser();
  const parsed = createPostSchema.parse(payload);

  await connectToDatabase();

  const content = sanitizeAndFilterText(parsed.content);

  const doc: any = {
    authorId: user._id,
    anonymousHandle: user.anonymousHandle,
    university: user.university,
    content,
    text: content,
    type: parsed.type,
    tags: parsed.tags ?? [],
    commentCount: 0,
    shareCount: 0,
    bookmarkCount: 0,
    viewCount: 0,
    isPinned: false,
    isRemoved: false,
    trendingScore: 0,
  };

  if (parsed.type === "poll" && parsed.poll) {
    const endsAt = new Date(Date.now() + (parsed.poll.durationHours || 24) * 60 * 60 * 1000);
    doc.poll = {
      question: sanitizeAndFilterText(parsed.poll.question),
      options: parsed.poll.options.map((o: any, idx: number) => ({ id: String(idx + 1), text: sanitizeAndFilterText(o.text), voteCount: 0 })),
      totalVotes: 0,
      endsAt,
      allowMultiple: !!parsed.poll.allowMultiple,
    };
  }

  await PostModel.create(doc);

  revalidatePath("/");
  revalidatePath("/trending");

  return { ok: true };
}
