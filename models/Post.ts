import { model, models, Schema, Types, type HydratedDocument } from "mongoose";
import UserModel from "@/models/User";

export const POST_TYPES = ["confession", "question", "hottake", "poll", "rant", "hot_take"] as const;

export type PostType = (typeof POST_TYPES)[number];

export interface ReactionCounts {
  fire: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface LegacyReactionCounts {
  fire: number;
  heart: number;
  laugh: number;
  skull: number;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface LegacyPollOption {
  label: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: Date;
  allowMultiple: boolean;
}

export interface PostAttributes {
  authorId: Types.ObjectId;
  anonymousHandle: string;
  university: string;
  content: string;
  type: PostType;
  tags: string[];
  reactionCounts: ReactionCounts;
  commentCount: number;
  shareCount: number;
  bookmarkCount: number;
  viewCount: number;
  isPinned: boolean;
  isRemoved: boolean;
  removedReason?: string;
  poll?: PollData;
  trendingScore: number;
  title?: string;
  college?: string;
  customUniversity?: string;
  isOtherUniversity?: boolean;
  pollOptions?: LegacyPollOption[];
  reactions?: LegacyReactionCounts;
  reportsCount?: number;
  text?: string;
  userId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const reactionCountsSchema = new Schema<ReactionCounts>(
  {
    fire: { type: Number, default: 0, min: 0 },
    heart: { type: Number, default: 0, min: 0 },
    laugh: { type: Number, default: 0, min: 0 },
    wow: { type: Number, default: 0, min: 0 },
    sad: { type: Number, default: 0, min: 0 },
    angry: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const legacyReactionsSchema = new Schema<LegacyReactionCounts>(
  {
    fire: { type: Number, default: 0, min: 0 },
    heart: { type: Number, default: 0, min: 0 },
    laugh: { type: Number, default: 0, min: 0 },
    skull: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const pollOptionSchema = new Schema<PollOption>(
  {
    id: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 100 },
    voteCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const pollSchema = new Schema<PollData>(
  {
    question: { type: String, required: true, trim: true, maxlength: 200 },
    options: { type: [pollOptionSchema], default: [] },
    totalVotes: { type: Number, default: 0, min: 0 },
    endsAt: { type: Date, required: true },
    allowMultiple: { type: Boolean, default: false },
  },
  { _id: false },
);

const postSchema = new Schema<PostAttributes>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, alias: "author" },
    anonymousHandle: { type: String, required: true, index: true, trim: true },
    university: { type: String, required: true, index: true, trim: true },
    content: { type: String, required: true, maxlength: 500, trim: true },
    type: {
      type: String,
      enum: POST_TYPES,
      default: "confession",
      index: true,
      set: (value: PostType) => (value === "hot_take" ? "hottake" : value),
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 5,
        message: "A post can have at most 5 tags.",
      },
      set: (value: string[]) => value.map((tag) => tag.trim()).filter(Boolean).slice(0, 5),
    },
    reactionCounts: { type: reactionCountsSchema, default: () => ({}) },
    commentCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    bookmarkCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    isPinned: { type: Boolean, default: false, index: true },
    isRemoved: { type: Boolean, default: false, index: true },
    removedReason: { type: String, default: "", trim: true },
    poll: { type: pollSchema, required: false, default: undefined },
    trendingScore: { type: Number, default: 0, index: true },
    title: { type: String, default: "", trim: true },
    college: { type: String, default: "", index: true, trim: true },
    customUniversity: { type: String, default: "", trim: true },
    isOtherUniversity: { type: Boolean, default: false },
    pollOptions: {
      type: [{ label: { type: String, required: true, trim: true }, votes: { type: Number, default: 0, min: 0 } }],
      default: [],
    },
    reactions: { type: legacyReactionsSchema, default: () => ({}) },
    reportsCount: { type: Number, default: 0, min: 0 },
    text: { type: String, default: "", trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, minimize: false },
);

postSchema.index({ university: 1, createdAt: -1 });
postSchema.index({ trendingScore: -1 });
postSchema.index({ university: 1, trendingScore: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ content: "text" });

export type PostDocument = HydratedDocument<PostAttributes>;

const PostModel = models.Post || model<PostAttributes>("Post", postSchema);

export default PostModel;
