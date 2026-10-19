import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
export async function GET() {
  try {
    const c = await getCatalog();
    return NextResponse.json(
      { ...c, reviews: c.reviews.filter((r) => r.published && r.permission) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "The catalog is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
