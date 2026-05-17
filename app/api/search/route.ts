import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PostModel from "@/models/Post";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    const university = url.searchParams.get("university") ?? undefined;
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = 20;

    await connectToDatabase();

    const filter: any = { isRemoved: false };
    if (university) filter.university = university;
    if (q.trim().length > 0) {
      filter.$text = { $search: q.trim() };
    }

    const posts = await PostModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[SEARCH] error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
