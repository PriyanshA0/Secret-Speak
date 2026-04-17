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
      await fetch("/api/posts", {
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
      setTitle("");
      setContent("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="rounded-[30px] border border-white/10 bg-[#121220]/90 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POST_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setType(item.value)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                type === item.value
                  ? "border-fuchsia-300 bg-fuchsia-500/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <p className="text-lg">{item.label === "Confession" ? "💬" : item.label === "Question" ? "❓" : item.label === "Poll" ? "📊" : "🔥"}</p>
              <p className="mt-2 font-medium">{item.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-white/65">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              placeholder="Give it a sharp headline"
              maxLength={120}
            />
          </label>

          <label className="grid gap-2 text-sm text-white/65">
            Content
            <textarea
              rows={8}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
              placeholder="Tell it anonymously..."
              maxLength={800}
            />
          </label>

          {type === "poll" ? (
            <label className="grid gap-2 text-sm text-white/65">
              Poll options, one per line
              <textarea
                rows={4}
                value={pollOptions}
                onChange={(event) => setPollOptions(event.target.value)}
                className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
              />
            </label>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-white/40">Your identity stays hidden. Toxic text is filtered before saving.</p>
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(236,72,153,0.35)] disabled:opacity-60"
            >
              Post anonymously
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4 rounded-[30px] border border-white/10 bg-white/5 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
        <p className="text-xs uppercase tracking-[0.28em] text-white/40">Live preview</p>
        <div className="rounded-[28px] bg-gradient-to-br from-fuchsia-500/70 to-violet-700/80 p-5">
          <p className="text-sm text-white/70">@your_anonymous_name</p>
          <h3 className="mt-3 text-lg font-semibold">{livePreview.title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/85">{livePreview.content}</p>
        </div>
      </aside>
    </section>
  );
}
