import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");

  if (!process.env.PUBLISH_SECRET || key !== process.env.PUBLISH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");

  return NextResponse.json({ ok: true, message: "Published — blog pages refreshed." });
}
