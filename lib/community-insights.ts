import { connectToDatabase } from "@/lib/mongodb";
import PostModel from "@/models/Post";
import CommentModel from "@/models/Comment";
import ReactionModel from "@/models/Reaction";

export interface CommunityStat {
  label: string;
  value: string;
}

export interface TrendingTopic {
  name: string;
  count: string;
}

export interface CommunityInsights {
  stats: CommunityStat[];
  topics: TrendingTopic[];
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "have",
  "just",
  "your",
  "about",
  "what",
  "when",
  "where",
  "which",
  "would",
  "there",
  "their",
  "they",
  "them",
  "were",
  "been",
  "into",
  "after",
  "before",
  "while",
  "campus",
  "college",
  "really",
  "still",
  "only",
  "more",
  "very",
  "than",
  "much",
  "some",
  "any",
  "our",
  "you",
  "are",
  "was",
  "had",
  "has",
  "not",
  "but",
  "all",
  "its",
  "out",
  "can",
  "cant",
  "dont",
  "did",
  "does",
  "why",
  "how",
  "who",
  "him",
  "her",
  "his",
  "she",
  "he",
  "our",
  "we",
  "im",
  "ive",
  "its",
]);

function compactNumber(input: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(input);
}

function titleCase(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
    .join(" ");
}

function extractKeywords(text: string) {
  const matches = text.toLowerCase().match(/[a-z][a-z0-9']{2,}/g) ?? [];
  return matches.filter((word) => !STOP_WORDS.has(word));
}

export async function getCommunityInsights(university?: string): Promise<CommunityInsights> {
  await connectToDatabase();

  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const campusQuery = university ? { college: university } : {};
  const campusPostIds = university ? await PostModel.find(campusQuery).distinct("_id") : null;

  const [postsToday, totalReactions, recentPosts, postsAuthors, legacyPostUsers, commentAuthors, reactionUsers] = await Promise.all([
    PostModel.countDocuments({ ...campusQuery, createdAt: { $gte: dayStart } }),
    university ? ReactionModel.countDocuments({ post: { $in: campusPostIds ?? [] } }) : ReactionModel.countDocuments({}),
    PostModel.find({ ...campusQuery, createdAt: { $gte: monthAgo } })
      .sort({ createdAt: -1 })
      .limit(300)
      .select("title content text type commentCount commentsCount reactions")
      .lean(),
    PostModel.distinct("author", { ...campusQuery, createdAt: { $gte: weekAgo } }),
    PostModel.distinct("userId", { ...campusQuery, createdAt: { $gte: weekAgo } }),
    university
      ? CommentModel.distinct("author", { createdAt: { $gte: weekAgo }, post: { $in: campusPostIds ?? [] } })
      : CommentModel.distinct("author", { createdAt: { $gte: weekAgo } }),
    university
      ? ReactionModel.distinct("user", { createdAt: { $gte: weekAgo }, post: { $in: campusPostIds ?? [] } })
      : ReactionModel.distinct("user", { createdAt: { $gte: weekAgo } }),
  ]);

  const activeUsers = new Set<string>([
    ...postsAuthors.map((id) => String(id)),
    ...legacyPostUsers.map((id) => String(id)),
    ...commentAuthors.map((id) => String(id)),
    ...reactionUsers.map((id) => String(id)),
  ]);

  const keywordScores = new Map<string, number>();

  for (const post of recentPosts) {
    const postRecord = post as {
      title?: string;
      content?: string;
      text?: string;
      commentCount?: number;
      commentsCount?: number;
      reactions?: { fire?: number; laugh?: number; skull?: number; heart?: number };
    };

    const text = `${postRecord.title ?? ""} ${postRecord.content ?? postRecord.text ?? ""}`;
    const keywords = extractKeywords(text);

    if (keywords.length === 0) {
      continue;
    }

    const commentBoost = postRecord.commentCount ?? postRecord.commentsCount ?? 0;
    const reactionBoost =
      (postRecord.reactions?.fire ?? 0) +
      (postRecord.reactions?.laugh ?? 0) +
      (postRecord.reactions?.skull ?? 0) +
      (postRecord.reactions?.heart ?? 0);

    const weight = 1 + commentBoost * 0.15 + reactionBoost * 0.08;

    for (const word of keywords) {
      keywordScores.set(word, (keywordScores.get(word) ?? 0) + weight);
    }
  }

  const topics = [...keywordScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, score]) => ({
      name: titleCase(word.replace(/'/g, "")),
      count: `${Math.max(1, Math.round(score))} mentions`,
    }));

  const fallbackTopics = [
    { name: "Campus Life", count: "0 mentions" },
    { name: "Placements", count: "0 mentions" },
    { name: "Hostel", count: "0 mentions" },
    { name: "Mess Food", count: "0 mentions" },
  ];

  const stats: CommunityStat[] = [
    { label: "Active Users (7d)", value: compactNumber(activeUsers.size) },
    { label: "Posts Today", value: compactNumber(postsToday) },
    { label: "Reactions", value: compactNumber(totalReactions) },
  ];

  return {
    stats,
    topics: topics.length ? topics : fallbackTopics,
  };
}
