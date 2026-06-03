import { NextRequest, NextResponse } from "next/server";

import { syncMarketingContact } from "@/lib/resend-marketing";

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

    const result = await syncMarketingContact({
      email,
      newsletterOptIn: true,
      sendNewsletterConfirmation: true,
    });

    if (!result.ok) {
      console.error(`Newsletter subscription failed: ${result.reason}`);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
