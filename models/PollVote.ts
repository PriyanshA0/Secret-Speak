import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

export interface PollVoteAttributes {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  optionIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const pollVoteSchema = new Schema<PollVoteAttributes>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    optionIds: { type: [String], default: [] },
  },
  { timestamps: true, minimize: false },
);

pollVoteSchema.index({ userId: 1, postId: 1 }, { unique: true });

export type PollVoteDocument = HydratedDocument<PollVoteAttributes>;

const PollVoteModel = models.PollVote || model<PollVoteAttributes>("PollVote", pollVoteSchema);

export default PollVoteModel;
