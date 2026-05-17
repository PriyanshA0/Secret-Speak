import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import ReactionModel from "@/models/Reaction";
import PostModel from "@/models/Post";
import CommentModel from "@/models/Comment";
import { reactionSchema } from "@/lib/validators";

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const user = await requireCurrentUser();
    const { postId } = await params;
    const body = await request.json();
    const parsed = reactionSchema.parse(body);

    await connectToDatabase();

    const targetType = parsed.targetType || "post";
    const targetId = targetType === "comment" && parsed.targetId ? parsed.targetId : postId;

    // find existing reaction
    const existing = await ReactionModel.findOne({ userId: user._id, targetType, targetId });

    if (existing && existing.emoji === parsed.emoji) {
      // toggle off
      await existing.deleteOne();
      if (targetType === "post") {
        await PostModel.findByIdAndUpdate(targetId, { $inc: { [`reactionCounts.${parsed.emoji}`]: -1 } } as any);
      } else {
        await CommentModel.findByIdAndUpdate(targetId, { $inc: { [`reactionCounts.${parsed.emoji}`]: -1 } } as any);
      }
      return NextResponse.json({ ok: true, action: "removed" });
    }

    if (existing && existing.emoji !== parsed.emoji) {
      // change emoji
      const prev = existing.emoji;
      existing.emoji = parsed.emoji;
      await existing.save();
      if (targetType === "post") {
        await PostModel.findByIdAndUpdate(targetId, { $inc: { [`reactionCounts.${parsed.emoji}`]: 1, [`reactionCounts.${prev}`]: -1 } } as any);
      } else {
        await CommentModel.findByIdAndUpdate(targetId, { $inc: { [`reactionCounts.${parsed.emoji}`]: 1, [`reactionCounts.${prev}`]: -1 } } as any);
      }
      return NextResponse.json({ ok: true, action: "updated" });
    }

    // create new reaction
    await ReactionModel.create({ userId: user._id, targetType, targetId, emoji: parsed.emoji });
    if (targetType === "post") {
      await PostModel.findByIdAndUpdate(targetId, { $inc: { [`reactionCounts.${parsed.emoji}`]: 1 } } as any);
    } else {
      await CommentModel.findByIdAndUpdate(targetId, { $inc: { [`reactionCounts.${parsed.emoji}`]: 1 } } as any);
    }

    return NextResponse.json({ ok: true, action: "created" });
  } catch (err) {
    console.error("[REACTIONS] POST error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to react" }, { status: 500 });
  }
}

