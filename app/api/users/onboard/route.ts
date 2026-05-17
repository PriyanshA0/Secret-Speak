import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { onboardingSchema } from "@/lib/validators";
import { makeAnonymousHandle } from "@/lib/utils";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  try {
    console.log("[ONBOARD] POST /api/users/onboard called");
    const { userId } = await auth();
    console.log("[ONBOARD] auth() userId:", userId);
    if (!userId) {
      console.log("[ONBOARD] No userId from auth, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[ONBOARD] Parsed body:", body);
    const parsedResult = onboardingSchema.partial().safeParse(body);
    if (!parsedResult.success) {
      console.log("[ONBOARD] Validation failed:", parsedResult.error.flatten());
      return NextResponse.json(
        { error: "Invalid onboarding data", details: parsedResult.error.flatten() },
        { status: 400 },
      );
    }
    const parsed = parsedResult.data;
    console.log("[ONBOARD] Schema parsed successfully:", parsed);

    console.log("[ONBOARD] Connecting to database...");
    await connectToDatabase();
    console.log("[ONBOARD] DB connected");

    const existing = await UserModel.findOne({ clerkId: userId });
    console.log("[ONBOARD] Existing user found:", existing ? "yes" : "no");

    if (!existing) {
      const college = parsed.college ?? "Unknown campus";
      const university = parsed.university ?? college;
      const profileVisible = parsed.profileVisible ?? false;
      const phone = parsed.phone ?? "";

      console.log("[ONBOARD] Creating new user:", { college, university, phone, profileVisible });
      const newUser = await UserModel.create({
        clerkId: userId,
        anonymousHandle: makeAnonymousHandle(userId),
        college,
        university,
        phone,
        profileVisible,
        onboardingComplete: true,
      });
      console.log("[ONBOARD] User created successfully:", newUser._id);
      return NextResponse.json({ ok: true, created: true });
    }

    console.log("[ONBOARD] Updating existing user");
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
    console.log("[ONBOARD] User updated successfully");

    return NextResponse.json({ ok: true, created: false });
  } catch (error) {
    console.error("[ONBOARD] Error:", error instanceof Error ? error.message : error);
    console.error("[ONBOARD] Stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json({ error: "Onboarding failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
