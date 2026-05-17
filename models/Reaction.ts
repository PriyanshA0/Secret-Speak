import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

export const REACTION_EMOJIS = ["fire", "heart", "laugh", "wow", "sad", "angry", "skull"] as const;

export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ReactionAttributes {
  userId: Types.ObjectId;
  targetType: "post" | "comment";
  targetId: Types.ObjectId;
  emoji: ReactionEmoji;
  post?: Types.ObjectId;
  user?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const reactionSchema = new Schema<ReactionAttributes>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, alias: "user" },
    targetType: { type: String, enum: ["post", "comment"], required: true, default: "post", index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true, alias: "post" },
    emoji: {
      type: String,
      enum: REACTION_EMOJIS,
      required: true,
    },
  },
  { timestamps: true, minimize: false },
);

reactionSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
reactionSchema.index({ targetId: 1, targetType: 1 });

export type ReactionDocument = HydratedDocument<ReactionAttributes>;

const ReactionModel = models.Reaction || model<ReactionAttributes>("Reaction", reactionSchema);

export default ReactionModel;
