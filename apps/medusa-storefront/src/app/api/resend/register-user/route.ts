import { NextRequest, NextResponse } from "next/server";

const RESEND_REGISTERED_USER_SEGMENT_ID =
  process.env.RESEND_REGISTERED_USER_SEGMENT_ID;

/**
 * Handle POST requests to register an email address with Resend and respond with the result.
 *
 * Validates the `email` field from the request JSON, optionally creates a Resend contact
 * in the configured segment when environment variables are present, and returns a JSON
 * status object. Validation failures return a 400 response with an error; missing Resend
 * configuration or runtime errors return a success-like `{ ok: true }` without contacting Resend.
 *
 * @param request - A NextRequest whose JSON body must include an `email` string
 * @returns `{ error: "Valid email is required." }` with status 400 for invalid input, or `{ ok: true }` otherwise
 */
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
