import { NextRequest, NextResponse } from "next/server";

const RESEND_REGISTERED_USER_SEGMENT_ID =
  process.env.RESEND_REGISTERED_USER_SEGMENT_ID;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    if (!RESEND_REGISTERED_USER_SEGMENT_ID || !process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.contacts.create({
      email,
      segments: [{ id: RESEND_REGISTERED_USER_SEGMENT_ID }],
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
