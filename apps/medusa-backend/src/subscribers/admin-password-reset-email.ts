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

export default async function adminPasswordResetEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<PasswordResetEvent>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (data.actor_type !== "user") {
    return
  }

  const result = await sendAdminPasswordResetEmail({
    email: data.entity_id || "",
    token: data.token || "",
  })

  if (result.skipped) {
    logger.warn(
      `Skipped admin password reset email for ${data.entity_id || "unknown"}: ${result.reason}`
    )
    return
  }

  logger.info(`Sent admin password reset email for ${data.entity_id}`)
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
