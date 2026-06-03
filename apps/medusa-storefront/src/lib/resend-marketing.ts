type MarketingResult =
  | { ok: true; skipped?: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; reason: string }

type ContactSyncInput = {
  email: string
  registered?: boolean
  newsletterOptIn?: boolean
  sendNewsletterConfirmation?: boolean
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const MARKETING_EMAIL_ALLOWLIST = (process.env.MARKETING_EMAIL_ALLOWLIST || "")
  .split(",")
  .map((email) => normalizeEmail(email))
  .filter(Boolean)

const requiresAllowlist =
  process.env.MARKETING_EMAIL_REQUIRE_ALLOWLIST === "true"

const isAllowedEmail = (email: string) => {
  if (MARKETING_EMAIL_ALLOWLIST.length === 0) {
    return !requiresAllowlist
  }

  return MARKETING_EMAIL_ALLOWLIST.includes(normalizeEmail(email))
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const getRequiredConfig = ({
  registered,
  newsletterOptIn,
  sendNewsletterConfirmation,
}: Omit<ContactSyncInput, "email">): MarketingResult | null => {
  if (!process.env.RESEND_API_KEY) {
    return { ok: true, skipped: true, reason: "missing-resend-api-key" }
  }

  if (registered && !process.env.RESEND_REGISTERED_USER_SEGMENT_ID) {
    return {
      ok: true,
      skipped: true,
      reason: "missing-registered-user-segment",
    }
  }

  if (
    newsletterOptIn &&
    (!process.env.RESEND_NEWSLETTER_SEGMENT_ID || !process.env.RESEND_TOPIC_ID)
  ) {
    return {
      ok: true,
      skipped: true,
      reason: "missing-newsletter-config",
    }
  }

  if (sendNewsletterConfirmation && !process.env.MARKETING_EMAIL_FROM) {
    return {
      ok: true,
      skipped: true,
      reason: "missing-marketing-email-from",
    }
  }

  return null
}

const formatError = (scope: string, error: unknown) => {
  if (!error) {
    return scope
  }

  if (typeof error === "object" && "message" in error) {
    const maybeError = error as { name?: string; message?: string }
    return `${scope}:${maybeError.name ?? "unknown"}:${maybeError.message ?? "unknown"}`
  }

  return `${scope}:${String(error)}`
}

const sendNewsletterConfirmationEmail = async ({
  resend,
  email,
}: {
  resend: Awaited<ReturnType<typeof createResendClient>>
  email: string
}): Promise<MarketingResult> => {
  const from = process.env.MARKETING_EMAIL_FROM

  if (!from) {
    return { ok: true, skipped: true, reason: "missing-marketing-email-from" }
  }

  const subject = "Welcome to Nemuzoo updates"
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.5;max-width:640px;margin:0 auto;">
      <h1 style="font-size:24px;margin:0 0 16px;">You're subscribed</h1>
      <p>Thanks for joining Nemuzoo updates.</p>
      <p>We will send gentle notes about new companions, stories, and moments of comfort.</p>
      <p style="margin-top:24px;color:#52606d;">This confirmation was sent to ${escapeHtml(email)}.</p>
    </div>
  `
  const text = [
    "You're subscribed to Nemuzoo updates.",
    "",
    "We will send gentle notes about new companions, stories, and moments of comfort.",
  ].join("\n")

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
    text,
  })

  if (error) {
    return { ok: false, reason: formatError("newsletter-email", error) }
  }

  return { ok: true }
}

const createResendClient = async () => {
  const { Resend } = await import("resend")

  return new Resend(process.env.RESEND_API_KEY)
}

export const syncMarketingContact = async ({
  email,
  registered = false,
  newsletterOptIn = false,
  sendNewsletterConfirmation = false,
}: ContactSyncInput): Promise<MarketingResult> => {
  const normalizedEmail = normalizeEmail(email)

  if (!isAllowedEmail(normalizedEmail)) {
    return { ok: true, skipped: true, reason: "not-allowlisted" }
  }

  const missingConfig = getRequiredConfig({
    registered,
    newsletterOptIn,
    sendNewsletterConfirmation,
  })
  if (missingConfig) {
    return missingConfig
  }

  try {
    const resend = await createResendClient()
    const segments = [
      registered ? process.env.RESEND_REGISTERED_USER_SEGMENT_ID : undefined,
      newsletterOptIn ? process.env.RESEND_NEWSLETTER_SEGMENT_ID : undefined,
    ].filter((id): id is string => Boolean(id))
    const topics = newsletterOptIn
      ? [{ id: process.env.RESEND_TOPIC_ID!, subscription: "opt_in" as const }]
      : undefined

    const existing = await resend.contacts.get({ email: normalizedEmail })

    if (existing.error) {
      if (existing.error.name !== "not_found") {
        return { ok: false, reason: formatError("contact-get", existing.error) }
      }

      const created = await resend.contacts.create({
        email: normalizedEmail,
        segments: segments.map((id) => ({ id })),
        topics,
      })

      if (created.error) {
        return { ok: false, reason: formatError("contact-create", created.error) }
      }
    } else {
      const updated = await resend.contacts.update({ email: normalizedEmail })

      if (updated.error) {
        return { ok: false, reason: formatError("contact-update", updated.error) }
      }

      const currentSegments =
        segments.length > 0
          ? await resend.contacts.segments.list({ email: normalizedEmail })
          : null

      if (currentSegments?.error) {
        return {
          ok: false,
          reason: formatError("segment-list", currentSegments.error),
        }
      }

      const currentSegmentIds = new Set(
        currentSegments?.data?.data.map((segment) => segment.id) || []
      )

      for (const segmentId of segments) {
        if (currentSegmentIds.has(segmentId)) {
          continue
        }

        const added = await resend.contacts.segments.add({
          email: normalizedEmail,
          segmentId,
        })

        if (added.error) {
          return { ok: false, reason: formatError("segment-add", added.error) }
        }
      }

      if (topics) {
        const updatedTopics = await resend.contacts.topics.update({
          email: normalizedEmail,
          topics,
        })

        if (updatedTopics.error) {
          return {
            ok: false,
            reason: formatError("topic-update", updatedTopics.error),
          }
        }
      }
    }

    if (sendNewsletterConfirmation) {
      return sendNewsletterConfirmationEmail({
        resend,
        email: normalizedEmail,
      })
    }

    return { ok: true }
  } catch (error) {
    return { ok: false, reason: formatError("resend-exception", error) }
  }
}
