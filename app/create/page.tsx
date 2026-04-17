import PageShell from "@/components/PageShell";
import CreatePostModal from "@/components/CreatePostModal";
import { getCurrentUser } from "@/lib/auth";

export default async function CreatePage() {
  const user = await getCurrentUser();
  const campus = user?.university || user?.college || "";

  return (
    <PageShell title="Create post" subtitle="Share your confession, question, poll, or hot take." university={campus || undefined}>
      <CreatePostModal />
    </PageShell>
  );
}
