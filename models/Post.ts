import { model, models, Schema, type InferSchemaType } from "mongoose";

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["confession", "question", "poll", "hot_take"],
      required: true,
      index: true,
    },
    title: { type: String, default: "" },
    content: { type: String, required: true },
    college: { type: String, required: true, index: true },
    pollOptions: [
      {
        label: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    commentCount: { type: Number, default: 0 },
    reactions: {
      fire: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      skull: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
    },
    reportsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

postSchema.index({ college: 1, createdAt: -1 });

export type PostDocument = InferSchemaType<typeof postSchema>;

const PostModel = models.Post || model("Post", postSchema);

export default PostModel;
