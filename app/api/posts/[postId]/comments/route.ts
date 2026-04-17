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
