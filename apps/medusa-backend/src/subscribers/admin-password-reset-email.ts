import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { sendAdminPasswordResetEmail } from "../lib/account-email"

type PasswordResetEvent = {
  actor_type?: string
  entity_id?: string
  token?: string
}

const maskEmail = (email?: string) => {
  if (!email || !email.includes("@")) {
    return "unknown"
  }

  const [local, domain] = email.split("@")
  const visible = local.slice(0, 2)

  return `${visible}${"*".repeat(Math.max(local.length - 2, 1))}@${domain}`
}

export default async function adminPasswordResetEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<PasswordResetEvent>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (data.actor_type !== "user") {
    return
  }

  const maskedEmail = maskEmail(data.entity_id)

  const result = await sendAdminPasswordResetEmail({
    email: data.entity_id || "",
    token: data.token || "",
  })

  if (result.skipped) {
    logger.warn(
      `Skipped admin password reset email for ${maskedEmail}: ${result.reason}`
    )
    return
  }

  logger.info(`Sent admin password reset email for ${maskedEmail}`)
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
