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

  const normalizedType = parsed.type === "hot_take" ? "hottake" : parsed.type;

  const doc: any = {
    authorId: user._id,
    anonymousHandle: user.anonymousHandle,
    university: user.university,
    content,
    text: content,
    type: normalizedType,
    title: parsed.title ? sanitizeAndFilterText(parsed.title) : "",
    tags: parsed.tags ?? [],
    commentCount: 0,
    shareCount: 0,
    bookmarkCount: 0,
    viewCount: 0,
    isPinned: false,
    isRemoved: false,
    trendingScore: 0,
  };

  if (parsed.type === "poll") {
    const pollQuestion = parsed.poll?.question ?? parsed.title ?? "Poll";
    const pollOptions = parsed.poll?.options?.map((o: any) => o.text) ?? parsed.pollOptions ?? [];
    const durationHours = parsed.poll?.durationHours ?? 24;
    const allowMultiple = parsed.poll?.allowMultiple ?? false;

    const endsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    doc.poll = {
      question: sanitizeAndFilterText(pollQuestion),
      options: pollOptions.map((optionText: string, idx: number) => ({
        id: String(idx + 1),
        text: sanitizeAndFilterText(optionText),
        voteCount: 0,
      })),
      totalVotes: 0,
      endsAt,
      allowMultiple,
    };
  }

  await PostModel.create(doc);

  revalidatePath("/");
  revalidatePath("/trending");

  return { ok: true };
}
