import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import CommentSection from "@/components/CommentSection";
import PostCard from "@/components/PostCard";
import { connectToDatabase } from "@/lib/mongodb";
import { mapPostForClient } from "@/lib/post-helpers";
import type { CommentItem } from "@/lib/types";
import PostModel from "@/models/Post";
import CommentModel from "@/models/Comment";
import { getCurrentUser } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();
  const user = await getCurrentUser();
  const campus = user?.university || user?.college || "";

  const post = await PostModel.findById(id).populate("author", "anonymousHandle").lean();

  if (!post) {
    notFound();
  }

  const rawComments = await CommentModel.find({ post: id })
    .populate("author", "anonymousHandle")
    .sort({ createdAt: -1 })
    .lean();

  const comments: CommentItem[] = rawComments.map((comment) => ({
    _id: String(comment._id),
    postId: String(comment.post),
    content: comment.content,
    anonymousHandle: (comment.author as { anonymousHandle?: string } | undefined)?.anonymousHandle ?? "anon",
    createdAt: new Date(comment.createdAt).toISOString(),
    parentCommentId: comment.parentComment ? String(comment.parentComment) : undefined,
  }));

  return (
    <PageShell title="Post thread" subtitle="Replies stay anonymous. Keep it civil." university={campus || undefined}>
      <PostCard
        post={mapPostForClient({
          _id: String(post._id),
          type: post.type,
          content: post.content || (post as { text?: string }).text || "",
          title: post.title,
          college: post.college,
          createdAt: new Date(post.createdAt),
          author: { anonymousHandle: (post.author as { anonymousHandle?: string } | undefined)?.anonymousHandle },
          commentCount: post.commentCount ?? (post as { commentsCount?: number }).commentsCount,
          reactions: post.reactions,
          pollOptions: post.pollOptions,
        })}
      />
      <CommentSection postId={id} initialComments={comments} />
    </PageShell>
  );
}
