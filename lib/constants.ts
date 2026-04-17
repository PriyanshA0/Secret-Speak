import type { PostType, ReactionEmoji } from "@/lib/types";

export const POST_TYPES: Array<{ value: PostType; label: string }> = [
  { value: "confession", label: "Confession" },
  { value: "question", label: "Question" },
  { value: "poll", label: "Poll" },
  { value: "hot_take", label: "Hot Take" },
];

export const REACTION_EMOJIS: Array<{ value: ReactionEmoji; label: string; icon: string }> = [
  { value: "fire", label: "Fire", icon: "🔥" },
  { value: "laugh", label: "Laugh", icon: "😂" },
  { value: "skull", label: "Skull", icon: "💀" },
  { value: "heart", label: "Heart", icon: "❤️" },
];

export const PAGE_SIZE = 10;
