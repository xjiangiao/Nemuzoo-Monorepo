import { Resend } from "resend"

type OrderEmailLineItem = {
  product_title?: string | null
  title?: string | null
  variant_title?: string | null
  quantity?: number | string | null
  total?: number | null
}

type OrderEmailAddress = {
  first_name?: string | null
  last_name?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
}

type OrderEmailData = {
  id: string
  display_id?: number | string | null
  email?: string | null
  currency_code?: string | null
  total?: number | null
  subtotal?: number | null
  shipping_total?: number | null
  tax_total?: number | null
  items?: Array<OrderEmailLineItem | null> | null
  shipping_address?: OrderEmailAddress | null
}

const isEmailEnabled = () => process.env.ORDER_EMAILS_ENABLED !== "false"

type EmailSendResult =
  | { skipped: false }
  | { skipped: true; reason: string }

const getOrderItems = (order: OrderEmailData) =>
  (order.items || []).filter(
    (item): item is OrderEmailLineItem => !!item
  )

const formatMoney = (amount?: number | null, currencyCode = "usd") => {
  if (typeof amount !== "number") {
    return "-"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const getOrderNumber = (order: OrderEmailData) =>
  order.display_id ? `#${order.display_id}` : order.id

const renderAddress = (address?: OrderEmailAddress | null) => {
  if (!address) {
    return ""
  }

  return [
    [address.first_name, address.last_name].filter(Boolean).join(" "),
    address.address_1,
    address.address_2,
    [address.city, address.province, address.postal_code].filter(Boolean).join(", "),
    address.country_code?.toUpperCase(),
  ]
    .filter(Boolean)
    .join("\n")
}

const renderItemsHtml = (order: OrderEmailData) => {
  const currencyCode = order.currency_code || "usd"

  const items = getOrderItems(order)

  if (!items.length) {
    return "<p>No line items were found for this order.</p>"
  }

  return `
    <table style="width:100%;border-collapse:collapse;margin:24px 0;">
      <thead>
        <tr>
          <th align="left" style="border-bottom:1px solid #ddd;padding:8px 0;">Item</th>
          <th align="center" style="border-bottom:1px solid #ddd;padding:8px 0;">Qty</th>
          <th align="right" style="border-bottom:1px solid #ddd;padding:8px 0;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((item) => {
            const title = item.product_title || item.title || "Item"
            const variant = item.variant_title ? ` (${item.variant_title})` : ""

            return `
              <tr>
                <td style="border-bottom:1px solid #eee;padding:10px 0;">${escapeHtml(title)}${escapeHtml(variant)}</td>
                <td align="center" style="border-bottom:1px solid #eee;padding:10px 0;">${escapeHtml(item.quantity ?? 1)}</td>
                <td align="right" style="border-bottom:1px solid #eee;padding:10px 0;">${formatMoney(item.total, currencyCode)}</td>
              </tr>
            `
          })
          .join("")}
      </tbody>
    </table>
  `
}

export const renderOrderConfirmationEmail = (order: OrderEmailData) => {
  const currencyCode = order.currency_code || "usd"
  const orderNumber = getOrderNumber(order)
  const address = renderAddress(order.shipping_address)

  return {
    subject: `Nemuzoo order ${orderNumber} confirmed`,
    text: [
      `Thank you for your order ${orderNumber}.`,
      "",
      "Order summary:",
      ...getOrderItems(order).map((item) => {
        const title = item.product_title || item.title || "Item"
        const variant = item.variant_title ? ` (${item.variant_title})` : ""
        return `- ${title}${variant} x ${item.quantity ?? 1}: ${formatMoney(item.total, currencyCode)}`
      }),
      "",
      `Subtotal: ${formatMoney(order.subtotal, currencyCode)}`,
      `Shipping: ${formatMoney(order.shipping_total, currencyCode)}`,
      `Tax: ${formatMoney(order.tax_total, currencyCode)}`,
      `Total: ${formatMoney(order.total, currencyCode)}`,
      address ? `\nShipping address:\n${address}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.5;max-width:640px;margin:0 auto;">
        <h1 style="font-size:24px;margin:0 0 16px;">Thank you for your order</h1>
        <p>We received your order <strong>${escapeHtml(orderNumber)}</strong> and will let you know when it is on the way.</p>
        ${renderItemsHtml(order)}
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tbody>
            <tr><td style="padding:4px 0;">Subtotal</td><td align="right">${formatMoney(order.subtotal, currencyCode)}</td></tr>
            <tr><td style="padding:4px 0;">Shipping</td><td align="right">${formatMoney(order.shipping_total, currencyCode)}</td></tr>
            <tr><td style="padding:4px 0;">Tax</td><td align="right">${formatMoney(order.tax_total, currencyCode)}</td></tr>
            <tr><td style="padding:8px 0;border-top:1px solid #ddd;"><strong>Total</strong></td><td align="right" style="border-top:1px solid #ddd;"><strong>${formatMoney(order.total, currencyCode)}</strong></td></tr>
          </tbody>
        </table>
        ${
          address
            ? `<h2 style="font-size:18px;margin:24px 0 8px;">Shipping address</h2><p style="white-space:pre-line;">${escapeHtml(address)}</p>`
            : ""
        }
        <p style="margin-top:24px;color:#52606d;">Questions? Reply to this email and we will help.</p>
      </div>
    `,
  }
}

export const sendOrderConfirmationEmail = async (
  order: OrderEmailData
): Promise<EmailSendResult> => {
  if (!isEmailEnabled()) {
    return { skipped: true, reason: "disabled" }
  }

  if (!order.email) {
    return { skipped: true, reason: "missing-order-email" }
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return { skipped: true, reason: "missing-resend-config" }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const email = renderOrderConfirmationEmail(order)

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: order.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })

    if (error) {
      return {
        skipped: true,
        reason: `resend-error:${error.name ?? "unknown"}:${error.message ?? "unknown"}`,
      }
    }
  } catch (error) {
    return {
      skipped: true,
      reason: `resend-exception:${error instanceof Error ? error.message : String(error)}`,
    }
  }

  return { skipped: false }
}
