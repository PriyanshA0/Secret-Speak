import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

export interface FollowAttributes {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const followSchema = new Schema<FollowAttributes>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    followingId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true, minimize: false },
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export type FollowDocument = HydratedDocument<FollowAttributes>;

const FollowModel = models.Follow || model<FollowAttributes>("Follow", followSchema);

export default FollowModel;