import PageShell from "@/components/PageShell";
import ProfileVisibility from "@/components/ProfileVisibility";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const campus = user?.university || user?.college || "Select a university";

  return (
    <PageShell title="Profile" subtitle="Manage your anonymous identity settings." university={campus}>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="neo-card p-6 hard-shadow">
          <p className="text-xs uppercase tracking-[0.28em] text-black/60">Anonymous identity</p>
          <h2 className="mt-3 text-2xl font-semibold text-black">@{user?.anonymousHandle ?? "guest"}</h2>
          <p className="mt-2 text-sm text-black/70">Your handle, campus, and profile privacy are what other students will see.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-[var(--card-bg)] px-4 py-4 border-2 border-black">
              <p className="text-xs uppercase tracking-[0.24em] text-black/50">Campus</p>
              <p className="mt-2 font-medium text-black">{campus}</p>
            </div>
            <div className="rounded-md bg-[var(--card-bg)] px-4 py-4 border-2 border-black">
              <p className="text-xs uppercase tracking-[0.24em] text-black/50">Phone</p>
              <p className="mt-2 font-medium text-black">{user?.phone || "Hidden"}</p>
            </div>
            <div className="rounded-md bg-[var(--card-bg)] px-4 py-4 border-2 border-black">
              <p className="text-xs uppercase tracking-[0.24em] text-black/50">Profile</p>
              <p className="mt-2 font-medium text-black">{user?.profileVisible ? "Visible" : "Hidden"}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ProfileVisibility initialValue={Boolean(user?.profileVisible)} />
            <Link href="/onboarding" className="rounded-full border-2 border-black bg-[var(--card-bg)] px-4 py-2 text-sm text-black/80 transition hover:bg-[var(--accent-yellow)]">
              Change university
            </Link>
          </div>
        </div>

        <aside className="neo-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-black/60">What this profile does</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
            <p>• Keeps your posts campus-only.</p>
            <p>• Lets you hide or show profile visibility.</p>
            <p>• Links your anonymous handle to a single university.</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
