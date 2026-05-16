import FeedClient from "@/components/FeedClient";
import PageShell from "@/components/PageShell";
import { getPosts } from "@/actions/getPosts";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const campus = user?.university || user?.college || "";
  const posts = await getPosts({ sort: "latest", page: 1 });

  return (
    <PageShell
      title="Campus feed"
      subtitle="Anonymous college chatter from all universities."
      university={campus || undefined}
    >
      <FeedClient initialPosts={posts} defaultSort="latest" initialUniversity="" />
    </PageShell>
  );
}
