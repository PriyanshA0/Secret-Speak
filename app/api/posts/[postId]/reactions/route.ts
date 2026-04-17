import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addReaction } from "@/actions/addReaction";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";

interface RouteProps {
  params: Promise<{ postId: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const body = await request.json();

  await connectToDatabase();
  const user = await UserModel.findOne({ clerkId: userId });
  if (!user) {
    return NextResponse.json({ error: "User not onboarded" }, { status: 403 });
  }

  await addReaction(postId, body);

  return NextResponse.json({ ok: true });
}
