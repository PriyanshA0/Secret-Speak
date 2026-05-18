"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { mapPostForClient } from "@/lib/post-helpers";
import { PAGE_SIZE } from "@/lib/constants";
import PostModel from "@/models/Post";

interface GetPostsInput {
  college?: string;
  sort?: "latest" | "trending";
  page?: number;
}

export async function getPosts(input: GetPostsInput = {}) {
  await connectToDatabase();

  const page = Math.max(input.page ?? 1, 1);
  const limit = PAGE_SIZE;
  const skip = (page - 1) * limit;
  const query = input.college ? { college: input.college } : {};

  const sort: Record<string, 1 | -1> =
    input.sort === "trending"
      ? { commentCount: -1, "reactions.fire": -1, createdAt: -1 }
      : { createdAt: -1 };

  const docs = await PostModel.find(query)
    .populate("authorId", "anonymousHandle")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return docs.map((doc) =>
    mapPostForClient({
      _id: String(doc._id),
      type: doc.type,
      content: doc.content || (doc as { text?: string }).text || "",
      title: doc.title,
      college: doc.college,
      createdAt: new Date(doc.createdAt),
      author: { anonymousHandle: (doc.authorId as { anonymousHandle?: string } | undefined)?.anonymousHandle },
      commentCount: doc.commentCount ?? (doc as { commentsCount?: number }).commentsCount,
      reactions: doc.reactions,
      pollOptions: doc.pollOptions,
    }),
  );
}
