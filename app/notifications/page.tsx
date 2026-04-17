import PageShell from "@/components/PageShell";

export default function NotificationsPage() {
  return (
    <PageShell title="Notifications" subtitle="This MVP page is a placeholder for alerts and replies.">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
        <p className="text-sm text-white/70">Notification center is coming soon. It will show replies, mentions, and moderation updates.</p>
      </section>
    </PageShell>
  );
}
