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
  const title = parsed.title ? sanitizeAndFilterText(parsed.title) : "";

  await PostModel.create({
    author: user._id,
    userId: user._id,
    type: parsed.type,
    title,
    content,
    text: content,
    college: user.university || user.college,
    commentsCount: 0,
    pollOptions:
      parsed.type === "poll" && parsed.pollOptions
        ? parsed.pollOptions.map((label) => ({ label: sanitizeAndFilterText(label), votes: 0 }))
        : [],
  });

  revalidatePath("/");
  revalidatePath("/trending");

  return { ok: true };
}
