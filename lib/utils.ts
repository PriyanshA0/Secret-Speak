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

export function makeAnonymousHandle(clerkId: string) {
  const suffix = clerkId.slice(-4).toUpperCase();
  return `anon_${suffix}`;
}
