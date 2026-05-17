import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CommentModel from "@/models/Comment";
import PostModel from "@/models/Post";
import { requireCurrentUser } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  try {
    await connectToDatabase();
    const { postId } = params;
    const page = Number(new URL(request.url).searchParams.get("page") ?? "1");
    const limit = 50;
    const comments = await CommentModel.find({ postId }).sort({ createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean();
    return NextResponse.json({ comments });
  } catch (err) {
    console.error("[COMMENTS] GET error:", err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const user = await requireCurrentUser();
    const { postId } = params;
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
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addComment } from "@/actions/addComment";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";

interface RouteProps {
  params: Promise<{ postId: string }>;
}

export async function GET(_: Request, { params }: RouteProps) {
  const { postId } = await params;
  await connectToDatabase();

  const comments = await CommentModel.find({ post: postId })
    .populate("author", "anonymousHandle")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    comments: comments.map((comment) => ({
      _id: String(comment._id),
      postId: String(comment.post),
      content: comment.content,
      anonymousHandle: (comment.author as { anonymousHandle?: string } | undefined)?.anonymousHandle ?? "anon",
      createdAt: new Date(comment.createdAt).toISOString(),
      parentCommentId: comment.parentComment ? String(comment.parentComment) : undefined,
    })),
  });
}

export async function POST(request: Request, { params }: RouteProps) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const body = await request.json();

  await connectToDatabase();
  const user = await UserModel.findOne({ clerkId: userId });
  if (!user) {
    return NextResponse.json({ error: "User not onboarded" }, { status: 403 });
  }

  await addComment(postId, body);

  const latest = await CommentModel.findOne({ post: postId }).sort({ createdAt: -1 }).populate("author", "anonymousHandle").lean();

  if (!latest) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  return NextResponse.json({
    comment: {
      _id: String(latest._id),
      postId: String(latest.post),
      content: latest.content,
      anonymousHandle: (latest.author as { anonymousHandle?: string } | undefined)?.anonymousHandle ?? "anon",
      createdAt: new Date(latest.createdAt).toISOString(),
    },
  });
}
