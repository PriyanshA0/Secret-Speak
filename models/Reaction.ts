import { model, models, Schema, type InferSchemaType } from "mongoose";

const reactionSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    emoji: {
      type: String,
      enum: ["fire", "laugh", "skull", "heart"],
      required: true,
    },
  },
  { timestamps: true },
);

reactionSchema.index({ post: 1, user: 1, emoji: 1 }, { unique: true });

export type ReactionDocument = InferSchemaType<typeof reactionSchema>;

const ReactionModel = models.Reaction || model("Reaction", reactionSchema);

export default ReactionModel;
