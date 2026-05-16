import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/auth";
import NotificationsNavLink from "@/components/NotificationsNavLink";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/create", label: "Create Post" },
  { href: "/profile", label: "Profile" },
  { href: "/notifications", label: "Notifications" },
  { href: "/guidelines", label: "Guidelines" },
];

export default async function Navbar() {
  const { userId } = await auth();
  const user = await getCurrentUser();

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-4 border-black bg-[var(--bg)] px-4 py-3 text-black lg:hidden">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">SecretSpeak</p>
          <p className="text-sm text-white/70">{user?.university || user?.college || "Select university"}</p>
        </div>
        <div>{userId ? <UserButton afterSignOutUrl="/" /> : <Link href="/sign-in" className="neo-btn">Sign in</Link>}</div>
      </header>
      <aside className="hidden h-screen w-[260px] shrink-0 border-r-4 border-black bg-[var(--card-bg)] px-5 py-6 lg:flex lg:flex-col">
      <div className="neo-card p-5 hard-shadow">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-yellow)] text-2xl border-2 border-black">🎭</div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-black/60">SecretSpeak</p>
            <h1 className="text-xl font-semibold text-black">Anonymous campus</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-black/70">Say what you can’t say publicly. Keep it campus-only, anonymous, and sharp.</p>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => (
          item.href === "/notifications" ? (
            <NotificationsNavLink
              key={item.href}
              className="flex items-center justify-between rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-black transition hover:bg-[var(--accent-yellow)]"
            />
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-black transition hover:bg-[var(--accent-yellow)]"
            >
              <span>{item.label}</span>
              <span className="text-xs text-black/40">→</span>
            </Link>
          )
        ))}
      </nav>

      <div className="mt-auto space-y-4 border-t border-white/10 pt-5 text-sm text-white/60">
        <div className="rounded-md neo-card px-4 py-3">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Campus</p>
          <p className="mt-1 font-medium text-black">{user?.university || user?.college || "Select your university"}</p>
        </div>
        <div className="flex items-center justify-between">
          {userId ? <UserButton afterSignOutUrl="/" /> : <Link href="/sign-in" className="neo-btn">Sign in</Link>}
          <span className="text-xs text-black/50">Anonymous & secure</span>
        </div>
      </div>
      </aside>
    </>
  );
}
