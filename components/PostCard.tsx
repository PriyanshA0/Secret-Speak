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
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:border-fuchsia-300/30">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-fuchsia-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
          {typeLabels[post.type]}
        </span>
        <span className="text-xs text-white/35">{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      {post.title ? <h3 className="mt-4 text-lg font-semibold text-white">{post.title}</h3> : null}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/80">{post.content || "No text available for this post yet."}</p>

      {post.pollOptions?.length ? (
        <div className="mt-4 space-y-2">
          {post.pollOptions.map((option) => (
            <div key={option.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
              {option.label} <span className="text-white/35">({option.votes})</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">@{post.anonymousHandle}</span>
        <span className="text-xs text-white/45">{post.college}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <ReactionBar postId={post._id} reactions={post.reactions} />
        <Link href={`/post/${post._id}`} className="text-sm font-medium text-fuchsia-200 hover:text-fuchsia-100">
          {post.commentCount} comments →
        </Link>
      </div>
    </article>
  );
}
