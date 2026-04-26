import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import NotificationModel from "@/models/Notification";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedLimit = Number(searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;

  await connectToDatabase();

  const [notifications, unreadCount] = await Promise.all([
    NotificationModel.find({ recipientUserId: userId }).sort({ createdAt: -1 }).limit(limit).lean(),
    NotificationModel.countDocuments({ recipientUserId: userId, isRead: false }),
  ]);

  return NextResponse.json({
    notifications: notifications.map((notification) => ({
      _id: String(notification._id),
      type: notification.type,
      postId: notification.postId,
      postSnippet: notification.postSnippet,
      isRead: notification.isRead,
      createdAt: new Date(notification.createdAt).toISOString(),
    })),
    unreadCount,
  });
}