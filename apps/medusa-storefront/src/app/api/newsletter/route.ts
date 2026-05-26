import { NextRequest, NextResponse } from "next/server";

const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    if (!RESEND_AUDIENCE_ID || !process.env.RESEND_API_KEY) {
      // Resend not configured — silently accept for dev
      return NextResponse.json({ ok: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.contacts.create({
      email,
      audienceId: RESEND_AUDIENCE_ID,
      unsubscribed: false,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
