import { model, models, Schema, type InferSchemaType } from "mongoose";

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
  },
  { timestamps: true },
);

commentSchema.index({ post: 1, createdAt: -1 });

export type CommentDocument = InferSchemaType<typeof commentSchema>;

const CommentModel = models.Comment || model("Comment", commentSchema);

export default CommentModel;
