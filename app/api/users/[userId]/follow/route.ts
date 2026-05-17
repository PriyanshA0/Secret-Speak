import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import FollowModel from "@/models/Follow";
import UserModel from "@/models/User";

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const me = await requireCurrentUser();
    const { userId: targetClerkId } = await params;
    await connectToDatabase();

    const target = await UserModel.findById(targetClerkId) || await UserModel.findOne({ clerkId: targetClerkId });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (String(me._id) === String(target._id)) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

    const existing = await FollowModel.findOne({ followerId: me._id, followingId: target._id });
    if (existing) {
      await existing.deleteOne();
      await UserModel.findByIdAndUpdate(me._id, { $inc: { followingCount: -1 } });
      await UserModel.findByIdAndUpdate(target._id, { $inc: { followerCount: -1 } });
      return NextResponse.json({ ok: true, action: "unfollowed" });
    }

    await FollowModel.create({ followerId: me._id, followingId: target._id });
    await UserModel.findByIdAndUpdate(me._id, { $inc: { followingCount: 1 } });
    await UserModel.findByIdAndUpdate(target._id, { $inc: { followerCount: 1 } });
    return NextResponse.json({ ok: true, action: "followed" });
  } catch (err) {
    console.error("[FOLLOW] error:", err);
    return NextResponse.json({ error: "Failed to follow/unfollow" }, { status: 500 });
  }
}
