import { NextResponse } from "next/server";
import { loggedIn, sameOrigin } from "@/lib/auth";
import { getCatalog, saveCatalog } from "@/lib/catalog";
import { validateCatalog } from "@/lib/validation";
export async function GET() {
  if (!(await loggedIn()))
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json(await getCatalog(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !(await loggedIn()))
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing content.");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4 * 1024 * 1024) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Catalog exceeds 4 MB. Use smaller images." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const c = JSON.parse(Buffer.concat(chunks).toString());
    validateCatalog(c);
    return NextResponse.json(await saveCatalog(c));
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Could not save. Your changes remain in this tab.",
      },
      { status: 400 },
    );
  }
}
