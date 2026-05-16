import Link from "next/link";
import type { PostListItem } from "@/lib/types";
import ReactionBar from "@/components/ReactionBar";

interface PostCardProps {
  post: PostListItem;
}

const typeLabels: Record<PostListItem["type"], string> = {
  confession: "Confession",
  question: "Question",
  poll: "Poll",
  hot_take: "Hot Take",
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group overflow-hidden neo-card p-5 text-black hard-shadow transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full neo-tag px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          {typeLabels[post.type]}
        </span>
        <span className="text-xs text-black/50">{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      {post.title ? <h3 className="mt-4 text-lg font-semibold text-white">{post.title}</h3> : null}

      {post.title ? <h3 className="mt-4 text-lg font-semibold text-black">{post.title}</h3> : null}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-black/80">{post.content || "No text available for this post yet."}</p>

      {post.pollOptions?.length ? (
        <div className="mt-4 space-y-2">
          {post.pollOptions.map((option) => (
            <div key={option.label} className="rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-sm text-black/75">
              {option.label} <span className="text-white/35">({option.votes})</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t-2 border-black pt-4">
        <span className="rounded-full neo-tag px-3 py-1 text-xs">@{post.anonymousHandle}</span>
        <span className="text-xs text-black/50">{post.college}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <ReactionBar postId={post._id} reactions={post.reactions} />
        <Link href={`/post/${post._id}`} className="text-sm font-medium text-[var(--accent-orange)] hover:underline">
          {post.commentCount} comments →
        </Link>
      </div>
    </article>
  );
}
