import { Filter } from "bad-words";
import sanitizeHtml from "sanitize-html";
import type { PostListItem } from "@/lib/types";

const filter = new Filter();

export function sanitizeAndFilterText(text: string) {
  const sanitized = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return filter.clean(sanitized);
}

export function mapPostForClient(raw: {
  _id: string;
  type: PostListItem["type"];
  content: string;
  title?: string;
  college: string;
  createdAt: Date;
  author?: { anonymousHandle?: string };
  commentCount?: number;
  reactions?: Partial<PostListItem["reactions"]>;
  pollOptions?: PostListItem["pollOptions"];
}): PostListItem {
  return {
    _id: String(raw._id),
    type: raw.type,
    content: raw.content,
    title: raw.title,
    college: raw.college,
    anonymousHandle: raw.author?.anonymousHandle ?? "anon",
    createdAt: raw.createdAt.toISOString(),
    reactions: {
      fire: raw.reactions?.fire ?? 0,
      laugh: raw.reactions?.laugh ?? 0,
      skull: raw.reactions?.skull ?? 0,
      heart: raw.reactions?.heart ?? 0,
    },
    commentCount: raw.commentCount ?? 0,
    pollOptions: raw.pollOptions,
  };
}
