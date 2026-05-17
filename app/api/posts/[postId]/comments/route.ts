import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CommentModel from "@/models/Comment";
import PostModel from "@/models/Post";
import { requireCurrentUser } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;
    await connectToDatabase();
    const page = Number(new URL(request.url).searchParams.get("page") ?? "1");
    const limit = 50;
    const comments = await CommentModel.find({ postId }).sort({ createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean();
    return NextResponse.json({ comments });
  } catch (err) {
    console.error("[COMMENTS] GET error:", err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const user = await requireCurrentUser();
    const { postId } = await params;
    const body = await request.json();
    const parsed = createCommentSchema.parse(body);

    await connectToDatabase();

    const comment = await CommentModel.create({
      postId,
      authorId: user._id,
      content: parsed.content,
      parentCommentId: parsed.parentCommentId ?? null,
    });

    await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return NextResponse.json({ comment });
  } catch (err) {
    console.error("[COMMENTS] POST error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add comment" }, { status: 500 });
  }
}

