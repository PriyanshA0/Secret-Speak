import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BookmarkModel from "@/models/Bookmark";
import PostModel from "@/models/Post";

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const me = await requireCurrentUser();
    const { userId } = await params; // unused but kept for route compat
    const body = await request.json();
    const postId = body.postId;
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

    await connectToDatabase();
    const existing = await BookmarkModel.findOne({ userId: me._id, postId });
    if (existing) {
      await existing.deleteOne();
      await PostModel.findByIdAndUpdate(postId, { $inc: { bookmarkCount: -1 } } as any);
      return NextResponse.json({ ok: true, action: "removed" });
    }

    await BookmarkModel.create({ userId: me._id, postId });
    await PostModel.findByIdAndUpdate(postId, { $inc: { bookmarkCount: 1 } } as any);
    return NextResponse.json({ ok: true, action: "added" });
  } catch (err) {
    console.error("[BOOKMARK] error:", err);
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}
