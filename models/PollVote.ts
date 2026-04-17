import { model, models, Schema, type InferSchemaType } from "mongoose";

const pollVoteSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    optionIndex: { type: Number, required: true },
  },
  { timestamps: true },
);

pollVoteSchema.index({ post: 1, user: 1 }, { unique: true });

export type PollVoteDocument = InferSchemaType<typeof pollVoteSchema>;

const PollVoteModel = models.PollVote || model("PollVote", pollVoteSchema);

export default PollVoteModel;
