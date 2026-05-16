"use client";

import { useTransition } from "react";
import { REACTION_EMOJIS } from "@/lib/constants";

interface ReactionBarProps {
  postId: string;
  reactions: Record<"fire" | "laugh" | "skull" | "heart", number>;
}

export default function ReactionBar({ postId, reactions }: ReactionBarProps) {
  const [isPending, startTransition] = useTransition();

  function onReact(emoji: "fire" | "laugh" | "skull" | "heart") {
    startTransition(async () => {
      await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_EMOJIS.map((reaction) => (
        <button
          key={reaction.value}
          type="button"
          onClick={() => onReact(reaction.value)}
          disabled={isPending}
          className="neo-btn flex items-center gap-2 disabled:opacity-60"
        >
          <span>{reaction.icon}</span>
          <span className="text-sm">{reactions[reaction.value]}</span>
        </button>
      ))}
    </div>
  );
}
