import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { onboardingSchema } from "@/lib/validators";
import { makeAnonymousHandle } from "@/lib/utils";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = onboardingSchema.partial().parse(body);

  await connectToDatabase();

  const existing = await UserModel.findOne({ clerkId: userId });

  if (!existing) {
    const college = parsed.college ?? "Unknown campus";
    const university = parsed.university ?? college;
    const profileVisible = parsed.profileVisible ?? false;
    const phone = parsed.phone ?? "";

    await UserModel.create({
      clerkId: userId,
      anonymousHandle: makeAnonymousHandle(userId),
      college,
      university,
      phone,
      profileVisible,
      onboardingComplete: true,
    });

    return NextResponse.json({ ok: true, created: true });
  }

  if (parsed.college !== undefined) {
    existing.college = parsed.college;
  }
  if (parsed.university !== undefined) {
    existing.university = parsed.university;
  }
  if (parsed.phone !== undefined) {
    existing.phone = parsed.phone;
  }
  if (parsed.profileVisible !== undefined) {
    existing.profileVisible = parsed.profileVisible;
  }
  existing.onboardingComplete = true;
  await existing.save();

  return NextResponse.json({ ok: true, created: false });
}
