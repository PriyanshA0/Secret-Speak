import { NextResponse } from "next/server";
import { getPosts } from "@/actions/getPosts";

export async function GET(request: Request) {
  try {
    const posts = await getPosts({ sort: "latest" });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error) ? error.message : String(error) }, { status: 500 });
  }
}
