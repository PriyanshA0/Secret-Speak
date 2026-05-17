import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

export interface BookmarkAttributes {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookmarkSchema = new Schema<BookmarkAttributes>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  },
  { timestamps: true, minimize: false },
);

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

export type BookmarkDocument = HydratedDocument<BookmarkAttributes>;

const BookmarkModel = models.Bookmark || model<BookmarkAttributes>("Bookmark", bookmarkSchema);

export default BookmarkModel;