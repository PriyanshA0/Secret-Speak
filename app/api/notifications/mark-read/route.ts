import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import NotificationModel from "@/models/Notification";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  await NotificationModel.updateMany({ recipientUserId: userId, isRead: false }, { isRead: true });

  return NextResponse.json({ success: true });
}