import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Online checkout is not offered. Please enquire through WhatsApp or Instagram.",
    },
    { status: 410 },
  );
}
