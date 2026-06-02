import { Resend } from "resend"

type AccountEmailResult =
  | { skipped: false }
  | { skipped: true; reason: string }

type AdminPasswordResetInput = {
  email: string
  token: string
}

const isAccountEmailEnabled = () =>
  process.env.ACCOUNT_EMAILS_ENABLED !== "false"

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const getAdminOrigin = () => {
  const adminCors = process.env.ADMIN_CORS?.split(",")[0]?.trim()

  if (!adminCors) {
    return null
  }

  return adminCors.replace(/\/+$/, "")
}

export const getAdminPasswordResetUrl = ({
  email,
  token,
}: AdminPasswordResetInput) => {
  const adminOrigin = getAdminOrigin()

  if (!adminOrigin) {
    return null
  }

  const params = new URLSearchParams({
    token,
    email,
  })

  return `${adminOrigin}/app/reset-password?${params.toString()}`
}

export const renderAdminPasswordResetEmail = ({
  email,
  token,
}: AdminPasswordResetInput) => {
  const resetUrl = getAdminPasswordResetUrl({ email, token })

  if (!resetUrl) {
    return null
  }

  return {
    subject: "Reset your Nemuzoo admin password",
    text: [
      "A password reset was requested for your Nemuzoo admin account.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.5;max-width:640px;margin:0 auto;">
        <h1 style="font-size:24px;margin:0 0 16px;">Reset your admin password</h1>
        <p>A password reset was requested for your Nemuzoo admin account.</p>
        <p style="margin:28px 0;">
          <a href="${escapeHtml(resetUrl)}" style="display:inline-block;border-radius:999px;background:#111827;color:#ffffff;padding:12px 20px;text-decoration:none;font-weight:700;">
            Reset password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;color:#52606d;">${escapeHtml(resetUrl)}</p>
        <p style="margin-top:24px;color:#52606d;">If you did not request this, you can ignore this email.</p>
      </div>
    `,
  }
}

export const sendAdminPasswordResetEmail = async ({
  email,
  token,
}: AdminPasswordResetInput): Promise<AccountEmailResult> => {
  if (!isAccountEmailEnabled()) {
    return { skipped: true, reason: "disabled" }
  }

  if (!email) {
    return { skipped: true, reason: "missing-email" }
  }

  if (!token) {
    return { skipped: true, reason: "missing-token" }
  }

  if (!process.env.RESEND_API_KEY || !process.env.ACCOUNT_EMAIL_FROM) {
    return { skipped: true, reason: "missing-resend-config" }
  }

  const emailContent = renderAdminPasswordResetEmail({ email, token })

  if (!emailContent) {
    return { skipped: true, reason: "missing-admin-cors" }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.ACCOUNT_EMAIL_FROM,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  })

  return { skipped: false }
}
