import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PostModel from "@/models/Post";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const university = url.searchParams.get("university") ?? undefined;
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = 20;

    await connectToDatabase();
    const filter: any = { isRemoved: false };
    if (university) filter.university = university;

    const posts = await PostModel.find(filter).sort({ trendingScore: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[TRENDING] error:", err);
    return NextResponse.json({ error: "Failed to load trending" }, { status: 500 });
  }
}
