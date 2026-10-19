import { NextResponse } from "next/server";
import { loggedIn, sameOrigin } from "@/lib/auth";
import { getRequests, deleteRequest } from "@/lib/requests";
export async function GET() {
  if (!(await loggedIn()))
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    return NextResponse.json(await getRequests(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load requests." },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request) || !(await loggedIn()))
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    const { id } = await request.json();
    if (typeof id !== "string" || id.length > 100) throw new Error();
    await deleteRequest(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete this request." },
      { status: 400 },
    );
  }
}
