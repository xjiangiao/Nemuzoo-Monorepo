import { NextRequest, NextResponse } from "next/server";

const RESEND_TOPIC_ID = process.env.RESEND_TOPIC_ID;
const RESEND_NEWSLETTER_SEGMENT_ID = process.env.RESEND_NEWSLETTER_SEGMENT_ID;

export async function POST(request: NextRequest) {
  try {
    const { email, consent } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "You must agree to receive emails." },
        { status: 400 }
      );
    }

    if (!RESEND_TOPIC_ID || !RESEND_NEWSLETTER_SEGMENT_ID || !process.env.RESEND_API_KEY) {
      // Resend not configured — silently accept for dev
      return NextResponse.json({ ok: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.contacts.create({
      email,
      segments: [{ id: RESEND_NEWSLETTER_SEGMENT_ID }],
      topics: [{ id: RESEND_TOPIC_ID, subscription: "opt_in" }],
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
