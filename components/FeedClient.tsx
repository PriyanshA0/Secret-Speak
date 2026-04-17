"use client";

import { useEffect, useState } from "react";
import type { PostListItem } from "@/lib/types";
import PostCard from "@/components/PostCard";
import UniversitySelector from "@/components/UniversitySelector";
import { UNIVERSITY_OPTIONS } from "@/lib/universities";

interface FeedClientProps {
  initialPosts: PostListItem[];
  defaultSort?: "latest" | "trending";
  initialUniversity?: string;
}

export default function FeedClient({ initialPosts, defaultSort = "latest", initialUniversity = "" }: FeedClientProps) {
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts);
  const [sort, setSort] = useState<"latest" | "trending">(defaultSort);
  const [university, setUniversity] = useState(initialUniversity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  async function refresh(nextSort: "latest" | "trending" = sort, nextUniversity = university) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort: nextSort, page: "1" });
      if (nextUniversity) {
        params.set("college", nextUniversity);
      }
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const json = (await res.json()) as { posts: PostListItem[] };
        setPosts(json.posts);
        setSort(nextSort);
        setUniversity(nextUniversity);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[#121220]/90 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">University feed</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Choose your campus</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              Posts are isolated by university so students only see their own campus conversations.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => refresh("latest", university)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                sort === "latest" ? "bg-fuchsia-400 text-black" : "bg-white/8 text-white/70 hover:bg-white/12"
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => refresh("trending", university)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                sort === "trending" ? "bg-fuchsia-400 text-black" : "bg-white/8 text-white/70 hover:bg-white/12"
              }`}
            >
              Trending
            </button>
          </div>
        </div>

        <div className="mt-5">
          <UniversitySelector value={university} onChange={(nextUniversity) => refresh(sort, nextUniversity)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/45">
          {UNIVERSITY_OPTIONS.slice(0, 4).map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {item}
            </span>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-white/60">
          No posts yet for this campus. Be the first to start the conversation.
        </div>
      ) : null}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {loading ? <p className="text-center text-sm text-white/45">Loading campus feed...</p> : null}
    </section>
  );
}
