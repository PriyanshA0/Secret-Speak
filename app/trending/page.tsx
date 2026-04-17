import FeedClient from "@/components/FeedClient";
import PageShell from "@/components/PageShell";
import { getPosts } from "@/actions/getPosts";
import { getCurrentUser } from "@/lib/auth";

export default async function TrendingPage() {
  const user = await getCurrentUser();
  const campus = user?.university || user?.college || "";
  const posts = await getPosts({ sort: "trending", page: 1, college: campus || undefined });

  return (
    <PageShell title="Trending" subtitle="What everyone is reacting to right now." university={campus || undefined}>
      <FeedClient initialPosts={posts} defaultSort="trending" initialUniversity={campus} />
    </PageShell>
  );
}
