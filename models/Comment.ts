import { model, models, Schema, Types, type HydratedDocument } from "mongoose";
import UserModel from "@/models/User";

export interface CommentReactionCounts {
  fire: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface CommentAttributes {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  anonymousHandle: string;
  university: string;
  content: string;
  parentCommentId?: Types.ObjectId | null;
  replyCount: number;
  reactionCounts: CommentReactionCounts;
  isRemoved: boolean;
  post?: Types.ObjectId;
  author?: Types.ObjectId;
  parentComment?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const reactionCountsSchema = new Schema<CommentReactionCounts>(
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

const commentSchema = new Schema<CommentAttributes>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true, alias: "post" },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, alias: "author" },
    anonymousHandle: { type: String, required: true, trim: true, index: true },
    university: { type: String, required: true, trim: true, index: true },
    content: { type: String, required: true, maxlength: 280, trim: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null, index: true, alias: "parentComment" },
    replyCount: { type: Number, default: 0, min: 0 },
    reactionCounts: { type: reactionCountsSchema, default: () => ({}) },
    isRemoved: { type: Boolean, default: false, index: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true, minimize: false },
);

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1 });

commentSchema.pre("validate", async function syncCommentShape(next) {
  if (!this.postId && this.post) {
    this.postId = this.post;
  }

  if (!this.authorId && this.author) {
    this.authorId = this.author;
  }

  if (this.parentComment && !this.parentCommentId) {
    this.parentCommentId = this.parentComment;
  }

  if ((!this.anonymousHandle || !this.university) && this.authorId) {
    const author = await UserModel.findById(this.authorId).lean();
    if (author) {
      if (!this.anonymousHandle) {
        this.anonymousHandle = author.anonymousHandle;
      }
      if (!this.university) {
        this.university = author.university;
      }
    }
  }

  next();
});

export type CommentDocument = HydratedDocument<CommentAttributes>;

const CommentModel = models.Comment || model<CommentAttributes>("Comment", commentSchema);

export default CommentModel;
