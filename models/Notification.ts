import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

export const NOTIFICATION_TYPES = ["comment", "reply", "reaction", "mention", "poll-ended", "trending"] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationAttributes {
  recipientId?: Types.ObjectId;
  actorHandle: string;
  type: NotificationType;
  postId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  message: string;
  isRead: boolean;
  recipientUserId?: string;
  postSnippet?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<NotificationAttributes>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
    actorHandle: { type: String, required: true, default: "", trim: true, index: true },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      index: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: false, index: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", required: false, index: true },
    message: { type: String, required: true, default: "", trim: true },
    isRead: { type: Boolean, default: false, index: true },
    recipientUserId: { type: String, default: "", trim: true },
    postSnippet: { type: String, default: "", trim: true },
  },
  { timestamps: true, minimize: false },
);

notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });

export type NotificationDocument = HydratedDocument<NotificationAttributes>;

const NotificationModel = models.Notification || model<NotificationAttributes>("Notification", notificationSchema);

export default NotificationModel;