import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    -Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60)),
    "hour",
  );
}

export function makeAnonymousHandle(clerkId: string, entropy?: string) {
  const normalized = clerkId.replace(/[^a-z0-9]/gi, "").toUpperCase();
  const suffix = normalized.slice(-4) || "USER";
  const randomPart = (entropy ?? Math.random().toString(36).slice(2, 6)).toUpperCase();
  return `anon_${suffix}${randomPart}`;
}
