"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NotificationsNavLinkProps {
  className: string;
  showArrow?: boolean;
}

interface NotificationsResponse {
  unreadCount: number;
}

export default function NotificationsNavLink({ className, showArrow = true }: NotificationsNavLinkProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fetchCount() {
      try {
        const res = await fetch("/api/notifications?limit=1", { cache: "no-store" });
        if (!res.ok) {
          return;
        }

        const json = (await res.json()) as NotificationsResponse;
        if (mounted) {
          setUnreadCount(json.unreadCount ?? 0);
        }
      } catch {
        // Ignore fetch errors and keep previous badge state.
      }
    }

    void fetchCount();
    const timer = window.setInterval(() => {
      void fetchCount();
    }, 30000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <Link href="/notifications" className={className}>
      <span className="relative inline-flex items-center gap-2">
        <span>Notifications</span>
        {unreadCount > 0 ? (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </span>
      {showArrow ? <span className="text-xs text-white/30">→</span> : null}
    </Link>
  );
}