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
        <div className="rounded-[30px] border border-white/10 bg-[#121220]/90 p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Anonymous identity</p>
          <h2 className="mt-3 text-2xl font-semibold">@{user?.anonymousHandle ?? "guest"}</h2>
          <p className="mt-2 text-sm text-white/65">Your handle, campus, and profile privacy are what other students will see.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">Campus</p>
              <p className="mt-2 font-medium text-white">{campus}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">Phone</p>
              <p className="mt-2 font-medium text-white">{user?.phone || "Hidden"}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">Profile</p>
              <p className="mt-2 font-medium text-white">{user?.profileVisible ? "Visible" : "Hidden"}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ProfileVisibility initialValue={Boolean(user?.profileVisible)} />
            <Link href="/onboarding" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10">
              Change university
            </Link>
          </div>
        </div>

        <aside className="rounded-[30px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">What this profile does</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
            <p>• Keeps your posts campus-only.</p>
            <p>• Lets you hide or show profile visibility.</p>
            <p>• Links your anonymous handle to a single university.</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
