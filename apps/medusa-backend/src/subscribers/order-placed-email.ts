import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { sendOrderConfirmationEmail } from "../lib/order-email"

type OrderPlacedEvent = {
  id: string
}

export default async function orderPlacedEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "subtotal",
      "shipping_total",
      "tax_total",
      "items.product_title",
      "items.title",
      "items.variant_title",
      "items.quantity",
      "items.total",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.address_1",
      "shipping_address.address_2",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
      "shipping_address.country_code",
    ],
    filters: {
      id: data.id,
    },
  })

  const order = orders[0]
  if (!order) {
    logger.warn(`Skipped order confirmation email: order ${data.id} not found`)
    return
  }

  const result = await sendOrderConfirmationEmail(order)

  if (result.skipped) {
    logger.warn(
      `Skipped order confirmation email for order ${data.id}: ${result.reason}`
    )
    return
  }

  logger.info(`Sent order confirmation email for order ${data.id}`)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
