import { NextResponse } from "next/server";
import { checkPassword, loggedIn, login, logout, sameOrigin } from "@/lib/auth";
import { hasRedis, redis } from "@/lib/catalog";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; until: number }>();
export async function GET() {
  return NextResponse.json(
    { authenticated: await loggedIn() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  try {
    if (process.env.NODE_ENV === "production" && !hasRedis())
      return NextResponse.json(
        {
          error:
            "Configure durable storage and login throttling before enabling production admin.",
        },
        { status: 503 },
      );
    const key = "pookie:login-attempts";
    let count: number;
    if (hasRedis()) {
      count = await redis(["INCR", key]);
      if (count === 1) await redis(["EXPIRE", key, 900]);
    } else {
      const now = Date.now();
      const entry = attempts.get(key);
      const current =
        entry && entry.until > now ? entry : { count: 0, until: now + 900000 };
      current.count++;
      attempts.set(key, current);
      count = current.count;
    }
    if (count > 10)
      return NextResponse.json(
        { error: "Too many login attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    const body = await request.text();
    if (body.length > 3000)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    const { email, password } = JSON.parse(body);
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length > 500 ||
      !checkPassword(email, password)
    )
      return NextResponse.json(
        {
          error:
            "Email or password is incorrect, or owner access has not been configured.",
        },
        { status: 401 },
      );
    await login();
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json(
      { error: "Owner access is unavailable. Check server configuration." },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  await logout();
  return NextResponse.json({ authenticated: false });
}
