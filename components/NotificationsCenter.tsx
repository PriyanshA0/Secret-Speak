"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface NotificationItem {
  _id: string;
  type: "reaction" | "comment" | "trending";
  postId: string;
  postSnippet: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

const notificationMessage: Record<NotificationItem["type"], string> = {
  reaction: "Someone reacted to your post",
  comment: "Someone commented on your post",
  trending: "Your post is trending",
};

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) {
        return;
      }

      const data = (await res.json()) as NotificationsResponse;
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchNotifications();

    const timer = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  async function markAllRead() {
    setMarkingRead(true);
    try {
      const res = await fetch("/api/notifications/mark-read", { method: "POST" });
      if (!res.ok) {
        return;
      }

      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } finally {
      setMarkingRead(false);
    }
  }

  const hasNotifications = notifications.length > 0;
  const unreadLabel = useMemo(() => (unreadCount > 0 ? `${unreadCount} unread` : "All caught up"), [unreadCount]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 neo-card p-5 text-black hard-shadow">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">Inbox</p>
          <p className="mt-2 text-sm text-black/70">{unreadLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void fetchNotifications()}
            className="rounded-full border-2 border-black bg-[var(--card-bg)] px-4 py-2 text-sm text-black/80 transition hover:bg-[var(--accent-yellow)]"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void markAllRead()}
            disabled={markingRead || unreadCount === 0}
            className="neo-btn rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>
      </div>

      {loading ? <p className="text-sm text-white/60">Loading notifications...</p> : null}

      {!loading && !hasNotifications ? (
        <div className="neo-card p-6 text-black/70">No notifications yet. Reactions and comments on your posts will appear here.</div>
      ) : null}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <article key={notification._id} className={`p-5 rounded-md border-2 ${notification.isRead ? 'border-black bg-[var(--card-bg)] text-black/80' : 'border-black bg-[var(--accent-yellow)] text-black'}`}>
            <p className="text-sm font-medium">{notificationMessage[notification.type]}</p>
            <p className="mt-2 text-sm text-black/70">“{notification.postSnippet || "Post update"}{notification.postSnippet.length >= 40 ? "..." : ""}”</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-black/50">{new Date(notification.createdAt).toLocaleString()}</p>
              <Link href={`/post/${notification.postId}`} className="text-sm font-medium text-[var(--accent-orange)] hover:underline">View post →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}