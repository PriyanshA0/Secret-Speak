"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UNIVERSITY_OPTIONS } from "@/lib/universities";

export default function OnboardingPage() {
  const router = useRouter();
  const [university, setUniversity] = useState(UNIVERSITY_OPTIONS[0]);
  const [phone, setPhone] = useState("");
  const [profileVisible, setProfileVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewHandle = useMemo(
    () => `@anon_${university.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "USER"}`,
    [university],
  );

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college: university, university, phone, profileVisible }),
      });
      if (res.ok) {
        router.push("/");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.16),_transparent_36%),linear-gradient(180deg,#08080f_0%,#0d0d16_55%,#111126_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[34px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-fuchsia-300/70">SecretSpeak onboarding</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Choose your university</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            SecretSpeak works best when your feed is locked to your campus. Pick your university, personalize your anonymous identity, and jump in.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/65">University</p>
              <input
                list="university-options"
                value={university}
                onChange={(event) => setUniversity(event.target.value)}
                placeholder="Search or type your university"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
              <datalist id="university-options">
                {UNIVERSITY_OPTIONS.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>

              <div className="mt-4 flex flex-wrap gap-2">
                {UNIVERSITY_OPTIONS.slice(0, 8).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setUniversity(option)}
                    className={`rounded-full border px-3 py-2 text-xs transition ${
                      university === option
                        ? "border-fuchsia-300 bg-fuchsia-400/20 text-white"
                        : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-fuchsia-500/25 to-violet-700/40 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-white/40">Anonymous identity</p>
              <div className="mt-5 rounded-[28px] border border-white/10 bg-black/20 p-5 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-white/10 text-4xl">🎭</div>
                <p className="mt-5 text-lg font-semibold">{previewHandle}</p>
                <p className="mt-2 text-sm text-white/60">Your anonymous handle will appear on posts and comments.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/65">
              Phone (optional)
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                placeholder="+91..."
              />
            </label>

            <label className="flex items-end gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75">
              <input
                type="checkbox"
                checked={profileVisible}
                onChange={(event) => setProfileVisible(event.target.checked)}
                className="h-4 w-4 accent-fuchsia-400"
              />
              Allow profile visibility to classmates
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-white/45">We only need your university to keep the feed campus-specific. No public identity is shown.</p>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(236,72,153,0.35)] disabled:opacity-60"
            >
              Enter SecretSpeak
            </button>
          </div>
        </section>

        <aside className="space-y-4 rounded-[34px] border border-white/10 bg-[#121220]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
          <div className="rounded-[28px] bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">Why it matters</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
              <p>• Feed is isolated to your university.</p>
              <p>• Students can gossip, vent, and debate safely.</p>
              <p>• Trending stays college-specific instead of generic.</p>
              <p>• Anonymous handles keep identity protected.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">Campus vibes</p>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <div className="rounded-2xl bg-black/20 px-4 py-3">Confessions that only classmates understand.</div>
              <div className="rounded-2xl bg-black/20 px-4 py-3">Polls for mess, food, placements, and dorm life.</div>
              <div className="rounded-2xl bg-black/20 px-4 py-3">Hot takes that get the group chat talking.</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
