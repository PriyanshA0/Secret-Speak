import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";

export async function GET(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;
    await connectToDatabase();
    const post = await PostModel.findById(postId).populate("authorId", "anonymousHandle").lean();
    if (!post || post.isRemoved) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[POST_DETAIL] GET error:", err);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;
    await connectToDatabase();
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const post = await PostModel.findById(postId);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (String(post.authorId) !== String(user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    post.isRemoved = true;
    post.removedReason = "deleted-by-author";
    await post.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST_DETAIL] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
