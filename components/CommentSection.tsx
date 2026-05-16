"use client";

import { useState } from "react";
import type { CommentItem } from "@/lib/types";

interface CommentSectionProps {
  postId: string;
  initialComments: CommentItem[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitComment() {
    if (!content.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const json = (await res.json()) as { comment: CommentItem };
        setComments((prev) => [json.comment, ...prev]);
        setContent("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="neo-card p-4 hard-shadow">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          className="w-full rounded-md border-2 border-black p-3 text-sm outline-none"
          placeholder="Drop an anonymous comment..."
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={submitComment}
            disabled={submitting}
            className="neo-btn px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            Comment
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <article key={comment._id} className="neo-card p-4">
            <p className="text-sm text-black">{comment.content}</p>
            <p className="mt-2 text-xs text-black/50">
              @{comment.anonymousHandle} • {new Date(comment.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
