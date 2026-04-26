import PageShell from "@/components/PageShell";
import NotificationsCenter from "@/components/NotificationsCenter";

export default function NotificationsPage() {
  return (
    <PageShell title="Notifications" subtitle="Anonymous reactions and comments on your posts.">
      <NotificationsCenter />
    </PageShell>
  );
}
