"use client";

import { useMemo, useState } from "react";
import { POST_TYPES } from "@/lib/constants";

export default function CreatePostModal() {
  const [type, setType] = useState<(typeof POST_TYPES)[number]["value"]>("confession");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pollOptions, setPollOptions] = useState("Option 1\nOption 2");
  const [submitting, setSubmitting] = useState(false);

  const livePreview = useMemo(
    () => ({
      title: title || "Your anonymous post",
      content: content || "Write your confession here...",
    }),
    [title, content],
  );

  async function onSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          content,
          pollOptions:
            type === "poll"
              ? pollOptions
                  .split("\n")
                  .map((option) => option.trim())
                  .filter(Boolean)
              : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Failed to create post");
        return;
      }

      // success
      setTitle("");
      setContent("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="neo-card p-5 text-black hard-shadow">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POST_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setType(item.value)}
              className={`rounded-md border-2 border-black px-4 py-4 text-left transition ${
                type === item.value
                  ? "bg-[var(--accent-yellow)] text-black"
                  : "bg-[var(--card-bg)] text-black/80 hover:bg-[var(--accent-yellow)]"
              }`}
            >
              <p className="text-lg">{item.label === "Confession" ? "💬" : item.label === "Question" ? "❓" : item.label === "Poll" ? "📊" : "🔥"}</p>
              <p className="mt-2 font-medium">{item.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-black/70">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-black outline-none placeholder:text-black/40"
              placeholder="Give it a sharp headline"
              maxLength={120}
            />
          </label>

          <label className="grid gap-2 text-sm text-black/70">
            Content
            <textarea
              rows={8}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-4 text-black outline-none placeholder:text-black/40"
              placeholder="Tell it anonymously..."
              maxLength={800}
            />
          </label>

          {type === "poll" ? (
            <label className="grid gap-2 text-sm text-black/70">
              Poll options, one per line
              <textarea
                rows={4}
                value={pollOptions}
                onChange={(event) => setPollOptions(event.target.value)}
                className="rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-4 text-black outline-none placeholder:text-black/40"
              />
            </label>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-black/60">Your identity stays hidden. Toxic text is filtered before saving.</p>
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="neo-btn px-5 py-3 font-semibold disabled:opacity-60 hard-shadow"
            >
              Post anonymously
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="neo-card p-5 hard-shadow">
          <p className="text-xs uppercase tracking-[0.28em] text-black/40">Live preview</p>
          <div className="rounded-md bg-[var(--accent-orange)] p-5 mt-3 border-2 border-black">
            <p className="text-sm text-black/70">@your_anonymous_name</p>
            <h3 className="mt-3 text-lg font-semibold text-black">{livePreview.title}</h3>
            <p className="mt-3 text-sm leading-7 text-black/80">{livePreview.content}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
