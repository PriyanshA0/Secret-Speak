"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UNIVERSITY_OPTIONS } from "@/lib/universities";

export default function OnboardingPage() {
  const router = useRouter();
  const [university, setUniversity] = useState(UNIVERSITY_OPTIONS[0]);
  const [customUniversity, setCustomUniversity] = useState("");
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
      const isOther = university === "Other";
      const finalUniversity = isOther ? customUniversity : university;
      
      const res = await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college: finalUniversity,
          university: finalUniversity,
          customUniversity: isOther ? customUniversity : "",
          isOtherUniversity: isOther,
          phone,
          profileVisible,
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(`Onboarding failed: ${data?.error || data?.details || "Unknown error"}`);
        return;
      }
      
      alert("Welcome to SecretSpeak! Redirecting...");
      router.push("/");
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to complete onboarding"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-black sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="neo-card p-6 hard-shadow sm:p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-black/60">SecretSpeak onboarding</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">Choose your university</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70 sm:text-base">
            SecretSpeak works best when your feed is locked to your campus. Pick your university, personalize your anonymous identity, and jump in.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-md border-2 border-black bg-[var(--card-bg)] p-5">
              <p className="text-sm text-black/70">University</p>
              <input
                list="university-options"
                value={university}
                onChange={(event) => setUniversity(event.target.value)}
                placeholder="Search or type your university"
                className="mt-3 w-full rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-black outline-none placeholder:text-black/40"
              />
              <datalist id="university-options">
                {UNIVERSITY_OPTIONS.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>

              <div className="mt-4 flex flex-wrap gap-2">
                {UNIVERSITY_OPTIONS.slice(0, 12).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setUniversity(option)}
                    className={`rounded-full border-2 px-3 py-2 text-xs transition ${
                      university === option
                        ? "border-black bg-[var(--accent-yellow)] text-black"
                        : "border-black bg-[var(--card-bg)] text-black/70 hover:bg-[var(--accent-yellow)] hover:text-black"
                    }`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setUniversity("Other")}
                  className={`rounded-full border-2 px-3 py-2 text-xs transition ${
                    university === "Other"
                      ? "border-black bg-[var(--accent-yellow)] text-black"
                      : "border-black bg-[var(--card-bg)] text-black/70 hover:bg-[var(--accent-yellow)] hover:text-black"
                  }`}
                >
                  Other
                </button>
              </div>

              {university === "Other" && (
                <input
                  type="text"
                  value={customUniversity}
                  onChange={(event) => setCustomUniversity(event.target.value)}
                  placeholder="Enter your university/college name"
                  className="mt-3 w-full rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-black outline-none placeholder:text-black/40"
                />
              )}
            </div>

            <div className="neo-card p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-black/60">Anonymous identity</p>
              <div className="mt-5 rounded-md border-2 border-black bg-[var(--accent-orange)] p-5 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-md bg-[var(--accent-yellow)] text-4xl border-2 border-black">🎭</div>
                <p className="mt-5 text-lg font-semibold text-black">{previewHandle}</p>
                <p className="mt-2 text-sm text-black/70">Your anonymous handle will appear on posts and comments.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-black/70">
              Phone (optional)
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-black outline-none placeholder:text-black/40"
                placeholder="+91..."
              />
            </label>

            <label className="flex items-end gap-3 rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-4 text-sm text-black/75">
              <input
                type="checkbox"
                checked={profileVisible}
                onChange={(event) => setProfileVisible(event.target.checked)}
                className="h-4 w-4 accent-[var(--accent-orange)]"
              />
              Allow profile visibility to classmates
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-black/60">We only need your university to keep the feed campus-specific. No public identity is shown.</p>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="neo-btn rounded-full px-6 py-3 text-sm font-semibold hard-shadow disabled:opacity-60"
            >
              Enter SecretSpeak
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="neo-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-black/60">Why it matters</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-black/75">
              <p>• Feed is isolated to your university.</p>
              <p>• Students can gossip, vent, and debate safely.</p>
              <p>• Trending stays college-specific instead of generic.</p>
              <p>• Anonymous handles keep identity protected.</p>
            </div>
          </div>

          <div className="neo-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-black/60">Campus vibes</p>
            <div className="mt-4 grid gap-3 text-sm text-black/75">
              <div className="rounded-md bg-[var(--accent-yellow)] px-4 py-3 border-2 border-black">Confessions that only classmates understand.</div>
              <div className="rounded-md bg-[var(--accent-yellow)] px-4 py-3 border-2 border-black">Polls for mess, food, placements, and dorm life.</div>
              <div className="rounded-md bg-[var(--accent-yellow)] px-4 py-3 border-2 border-black">Hot takes that get the group chat talking.</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
