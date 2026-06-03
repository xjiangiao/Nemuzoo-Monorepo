import { NextRequest, NextResponse } from "next/server";

import { syncMarketingContact } from "@/lib/resend-marketing";

/**
 * Handle POST requests to register an email address with Resend and respond with the result.
 *
 * Validates the `email` field from the request JSON, syncs registered customers to Resend,
 * and optionally opts them into newsletter emails when `newsletterOptIn` is true.
 *
 * @param request - A NextRequest whose JSON body must include an `email` string
 * @returns `{ error: "Valid email is required." }` with status 400 for invalid input, or `{ ok: true }` otherwise
 */
export async function POST(request: NextRequest) {
  try {
    const { email, newsletterOptIn } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    const result = await syncMarketingContact({
      email,
      registered: true,
      newsletterOptIn: Boolean(newsletterOptIn),
      sendNewsletterConfirmation: Boolean(newsletterOptIn),
    });

    if (!result.ok) {
      console.warn(`Registered user marketing sync failed: ${result.reason}`);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
