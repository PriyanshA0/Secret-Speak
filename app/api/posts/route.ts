import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPosts } from "@/actions/getPosts";
import { createPost } from "@/actions/createPost";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") === "trending" ? "trending" : "latest";
  const page = Number(searchParams.get("page") ?? "1");
  const college = searchParams.get("college") ?? undefined;

  const posts = await getPosts({ sort, page, college });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    console.log("[POSTS] POST /api/posts called");
    const { userId } = await auth();
    console.log("[POSTS] auth() userId:", userId);
    if (!userId) {
      console.log("[POSTS] No userId from auth, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[POSTS] Connecting to database...");
    await connectToDatabase();
    console.log("[POSTS] DB connected");
    const user = await UserModel.findOne({ clerkId: userId });
    console.log("[POSTS] User found:", user ? "yes" : "no", "onboardingComplete:", user?.onboardingComplete);

    if (!user?.onboardingComplete) {
      console.log("[POSTS] User not onboarded, returning 403");
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
    }

    const body = await request.json();
    console.log("[POSTS] Creating post with type:", body.type);
    await createPost(body);
    console.log("[POSTS] Post created successfully");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POSTS] Error:", error instanceof Error ? error.message : error);
    console.error("[POSTS] Stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json({ error: "Post creation failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
