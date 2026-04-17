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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await UserModel.findOne({ clerkId: userId });

  if (!user?.onboardingComplete) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }

  const body = await request.json();
  await createPost(body);

  return NextResponse.json({ ok: true });
}
