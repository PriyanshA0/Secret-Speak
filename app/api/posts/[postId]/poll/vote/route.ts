import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import PollVoteModel from "@/models/PollVote";
import PostModel from "@/models/Post";

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const user = await requireCurrentUser();
    const { postId } = params;
    const body = await request.json();
    const optionIds: string[] = Array.isArray(body.optionIds) ? body.optionIds : [];
    if (optionIds.length === 0) {
      return NextResponse.json({ error: "No option selected" }, { status: 400 });
    }

    await connectToDatabase();
    const post = await PostModel.findById(postId);
    if (!post || !post.poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    if (post.poll.endsAt && new Date() > new Date(post.poll.endsAt)) {
      return NextResponse.json({ error: "Poll ended" }, { status: 400 });
    }

    // enforce allowMultiple
    if (!post.poll.allowMultiple && optionIds.length > 1) {
      return NextResponse.json({ error: "Multiple selections not allowed" }, { status: 400 });
    }

    const existing = await PollVoteModel.findOne({ userId: user._id, postId });
    if (existing) {
      // compute differences
      const prev = new Set(existing.optionIds);
      const next = new Set(optionIds);

      // decrement previous selections
      for (const opt of prev) {
        const found = post.poll.options.find((o: any) => o.id === opt);
        if (found) found.voteCount = Math.max(0, found.voteCount - 1);
      }

      // increment new selections
      for (const opt of next) {
        const found = post.poll.options.find((o: any) => o.id === opt);
        if (found) found.voteCount = (found.voteCount || 0) + 1;
      }

      existing.optionIds = optionIds;
      await existing.save();
    } else {
      // create vote
      await PollVoteModel.create({ userId: user._id, postId, optionIds });
      for (const opt of optionIds) {
        const found = post.poll.options.find((o: any) => o.id === opt);
        if (found) found.voteCount = (found.voteCount || 0) + 1;
      }
    }

    // recompute totalVotes
    post.poll.totalVotes = post.poll.options.reduce((s: number, o: any) => s + (o.voteCount || 0), 0);
    await post.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POLL] POST vote error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to vote" }, { status: 500 });
  }
}
