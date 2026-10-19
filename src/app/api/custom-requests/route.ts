import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/auth";
import { addRequest } from "@/lib/requests";
import { hasRedis, redis } from "@/lib/catalog";
let local = { count: 0, until: 0 };
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Please submit using the website form." },
      { status: 403 },
    );
  try {
    if (process.env.NODE_ENV === "production" && !hasRedis())
      return NextResponse.json(
        {
          error:
            "The request form is not enabled yet. Please contact the studio directly on Instagram or WhatsApp.",
        },
        { status: 503 },
      );
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing request.");
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 12000) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Your request is too long." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString());
    if (body.website)
      return NextResponse.json(
        { error: "Unable to accept this request." },
        { status: 400 },
      );
    const fields = [
      "name",
      "contact",
      "idea",
      "colors",
      "budget",
      "personalization",
    ] as const;
    for (const key of fields)
      if (
        typeof body[key] !== "string" ||
        !body[key].trim() ||
        body[key].length >
          (key === "idea" || key === "personalization" ? 2000 : 200)
      )
        return NextResponse.json(
          { error: `Please complete ${key} within the field limit.` },
          { status: 400 },
        );
    if (
      !/^([^\s@]+@[^\s@]+\.[^\s@]+|\+?[\d ()-]{10,20})$/.test(
        body.contact.trim(),
      )
    )
      return NextResponse.json(
        { error: "Enter a valid email or phone number." },
        { status: 400 },
      );
    let count: number;
    const key = "pookie:request-limit";
    if (hasRedis()) {
      count = await redis(["INCR", key]);
      if (count === 1) await redis(["EXPIRE", key, 3600]);
    } else {
      if (local.until < Date.now())
        local = { count: 0, until: Date.now() + 3600000 };
      count = ++local.count;
    }
    if (count > 30)
      return NextResponse.json(
        {
          error:
            "The studio is receiving many requests. Please try later or contact us directly.",
        },
        { status: 429 },
      );
    const result = await addRequest(
      Object.fromEntries(fields.map((k) => [k, body[k].trim()])) as Parameters<
        typeof addRequest
      >[0],
    );
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not save your request. Please try again or contact the studio directly.",
      },
      { status: 503 },
    );
  }
}
