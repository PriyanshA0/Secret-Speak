import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { getCommunityInsights } from "@/lib/community-insights";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  university?: string;
}

export default function PageShell({ title, subtitle, children, action, university }: PageShellProps) {
  const insightsPromise = getCommunityInsights(university);

  return (
    <PageShellAsync
      title={title}
      subtitle={subtitle}
      action={action}
      university={university}
      insightsPromise={insightsPromise}
    >
      {children}
    </PageShellAsync>
  );
}

async function PageShellAsync({
  title,
  subtitle,
  children,
  action,
  university,
  insightsPromise,
}: PageShellProps & { insightsPromise: ReturnType<typeof getCommunityInsights> }) {
  const insights = await insightsPromise;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Navbar />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-fuchsia-300/70">SecretSpeak</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
                  {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">{subtitle}</p> : null}
                  {university ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-100">
                      <span className="h-2 w-2 rounded-full bg-fuchsia-300" />
                      {university}
                    </div>
                  ) : null}
                </div>
                {action ? <div>{action}</div> : null}
              </div>
            </div>
            {children}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-[#121220]/90 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Trending now</p>
              <div className="mt-4 space-y-3">
                {insights.topics.map((spotlight) => (
                  <div key={spotlight.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{spotlight.name}</p>
                      <p className="text-xs text-white/40">{spotlight.count}</p>
                    </div>
                    <span className="text-sm text-emerald-300">↗</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#121220]/90 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Community stats</p>
              <div className="mt-4 space-y-3">
                {insights.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/5 px-4 py-4">
                    <p className="text-2xl font-semibold text-fuchsia-300">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/55">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
