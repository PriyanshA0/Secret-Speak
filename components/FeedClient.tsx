"use client";

import { useEffect, useState } from "react";
import type { PostListItem } from "@/lib/types";
import PostCard from "@/components/PostCard";

interface FeedClientProps {
  initialPosts: PostListItem[];
  defaultSort?: "latest" | "trending";
  initialUniversity?: string;
}

export default function FeedClient({ initialPosts, defaultSort = "latest", initialUniversity = "" }: FeedClientProps) {
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts);
  const [sort, setSort] = useState<"latest" | "trending">(defaultSort);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  async function refresh(nextSort: "latest" | "trending" = sort) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort: nextSort });
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const json = (await res.json()) as { posts: PostListItem[] };
        setPosts(json.posts);
        setSort(nextSort);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="neo-card p-5 text-black hard-shadow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-black/60">University feed</p>
            <h2 className="mt-2 text-2xl font-semibold text-black">Choose your campus</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              Posts are isolated by university so students only see their own campus conversations.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => refresh("latest")} 
              className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                sort === "latest" ? "border-black bg-[var(--accent-orange)] text-black" : "border-black bg-[var(--card-bg)] text-black/80 hover:bg-[var(--accent-yellow)]"
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => refresh("trending")} 
              className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                sort === "trending" ? "border-black bg-[var(--accent-orange)] text-black" : "border-black bg-[var(--card-bg)] text-black/80 hover:bg-[var(--accent-yellow)]"
              }`}
            >
              Trending
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-black/70">Showing posts from all universities.</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="neo-card p-8 text-center text-black/70">
          No posts yet for this campus. Be the first to start the conversation.
        </div>
      ) : null}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {loading ? <p className="text-center text-sm text-black/60">Loading campus feed...</p> : null}
    </section>
  );
}
