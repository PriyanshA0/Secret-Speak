import { model, models, Schema, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema(
  {
    recipientUserId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["reaction", "comment", "trending"],
      required: true,
    },
    postId: { type: String, required: true, index: true },
    postSnippet: { type: String, default: "" },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientUserId: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;

const NotificationModel = models.Notification || model("Notification", notificationSchema);

export default NotificationModel;