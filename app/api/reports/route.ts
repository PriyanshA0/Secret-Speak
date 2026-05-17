import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import ReportModel from "@/models/Report";
import { reportSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await request.json();
    const parsed = reportSchema.parse(body);

    await connectToDatabase();
    const report = await ReportModel.create({
      reporterId: user._id,
      targetType: parsed.targetType,
      targetId: parsed.targetId,
      reason: parsed.reason,
      details: parsed.details ?? "",
    });

    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("[REPORTS] POST error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to create report" }, { status: 500 });
  }
}
