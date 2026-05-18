import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { onboardingSchema } from "@/lib/validators";
import { makeAnonymousHandle } from "@/lib/utils";
import UserModel from "@/models/User";

function isDuplicateKeyError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const maybeCode = (error as { code?: unknown }).code;
  return maybeCode === 11000;
}

async function createUniqueAnonymousHandle(clerkId: string, excludeUserId?: string) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = makeAnonymousHandle(clerkId);
    const existing = await UserModel.findOne({
      anonymousHandle: candidate,
      ...(excludeUserId ? { _id: { $ne: excludeUserId } } : {}),
    })
      .select("_id")
      .lean();

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique anonymous handle.");
}

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
      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          const candidateHandle = await createUniqueAnonymousHandle(userId);
          const newUser = await UserModel.create({
            clerkId: userId,
            anonymousHandle: candidateHandle,
            college,
            university,
            phone,
            profileVisible,
            onboardingComplete: true,
          });
          console.log("[ONBOARD] User created successfully:", newUser._id);
          return NextResponse.json({ ok: true, created: true });
        } catch (createError) {
          if (!isDuplicateKeyError(createError)) {
            throw createError;
          }

          const keyPattern = (createError as { keyPattern?: Record<string, number> }).keyPattern;
          if (keyPattern?.clerkId) {
            const racedUser = await UserModel.findOne({ clerkId: userId });
            if (racedUser) {
              if (!racedUser.anonymousHandle) {
                racedUser.anonymousHandle = await createUniqueAnonymousHandle(userId, String(racedUser._id));
              }
              racedUser.college = college;
              racedUser.university = university;
              racedUser.phone = phone;
              racedUser.profileVisible = profileVisible;
              racedUser.onboardingComplete = true;
              await racedUser.save();
              return NextResponse.json({ ok: true, created: false });
            }
          }

          if (!keyPattern?.anonymousHandle) {
            throw createError;
          }
        }
      }

      throw new Error("Failed to allocate a unique anonymous handle. Please retry onboarding.");
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
    if (!existing.anonymousHandle) {
      existing.anonymousHandle = await createUniqueAnonymousHandle(userId, String(existing._id));
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
