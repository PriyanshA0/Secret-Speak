import PageShell from "@/components/PageShell";

export default function GuidelinesPage() {
  return (
    <PageShell title="Community guidelines" subtitle="Keep it anonymous, respectful, and campus-safe.">
      <section className="grid gap-4 lg:grid-cols-2">
        {[
          ["No doxxing", "Never post addresses, phone numbers, IDs, or anything that exposes a student."],
          ["No harassment", "Keep the vibe sharp, not cruel. No hate speech or targeted abuse."],
          ["No spam", "Don’t flood the feed with repeated posts or fake engagement."],
          ["Report issues", "If someone crosses the line, report it so moderation can review it."],
        ].map(([title, description]) => (
          <article key={title} className="neo-card p-5 text-black">
            <h2 className="text-lg font-semibold text-black">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-black/70">{description}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
