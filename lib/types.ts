export type PostType = "confession" | "question" | "poll" | "hot_take";

export type ReactionEmoji = "fire" | "laugh" | "skull" | "heart";

export interface PollOption {
  label: string;
  votes: number;
}

export interface PostListItem {
  _id: string;
  type: PostType;
  content: string;
  title?: string;
  college: string;
  anonymousHandle: string;
  createdAt: string;
  reactions: Record<ReactionEmoji, number>;
  commentCount: number;
  pollOptions?: PollOption[];
}

export interface CommentItem {
  _id: string;
  postId: string;
  content: string;
  anonymousHandle: string;
  createdAt: string;
  parentCommentId?: string;
}
