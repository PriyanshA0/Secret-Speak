import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/create", label: "Create Post" },
  { href: "/profile", label: "Profile" },
  { href: "/guidelines", label: "Guidelines" },
];

export default async function Navbar() {
  const { userId } = await auth();
  const user = await getCurrentUser();

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0a0a12]/95 px-4 py-3 text-white backdrop-blur lg:hidden">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">SecretSpeak</p>
          <p className="text-sm text-white/70">{user?.university || user?.college || "Select university"}</p>
        </div>
        <div>{userId ? <UserButton afterSignOutUrl="/" /> : <Link href="/sign-in" className="rounded-full bg-white/10 px-3 py-1.5 text-sm">Sign in</Link>}</div>
      </header>

      <aside className="hidden h-screen w-[260px] shrink-0 border-r border-white/10 bg-[#0a0a12]/95 px-5 py-6 lg:flex lg:flex-col">
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/15 to-cyan-500/10 p-5 shadow-[0_0_40px_rgba(163,55,215,0.12)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">🎭</div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">SecretSpeak</p>
            <h1 className="text-xl font-semibold text-white">Anonymous campus</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/65">Say what you can’t say publicly. Keep it campus-only, anonymous, and sharp.</p>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
          >
            <span>{item.label}</span>
            <span className="text-xs text-white/30">→</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 border-t border-white/10 pt-5 text-sm text-white/60">
        <div className="rounded-2xl bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">Campus</p>
          <p className="mt-1 font-medium text-white">{user?.university || user?.college || "Select your university"}</p>
        </div>
        <div className="flex items-center justify-between">
          {userId ? <UserButton afterSignOutUrl="/" /> : <Link href="/sign-in" className="text-white">Sign in</Link>}
          <span className="text-xs text-emerald-300">Anonymous & secure</span>
        </div>
      </div>
      </aside>
    </>
  );
}
