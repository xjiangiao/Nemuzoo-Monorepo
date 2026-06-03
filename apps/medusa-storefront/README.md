This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## ImageKit image delivery

Product images are uploaded by Medusa to Cloudflare R2 and delivered through ImageKit in the storefront. Set `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` to the ImageKit URL endpoint configured for the current environment.

- Production ImageKit should proxy `https://static.nemuzoo.com`.
- Staging ImageKit should proxy `https://static-staging.nemuzoo.com`.

The storefront converts absolute Medusa R2 image URLs into ImageKit-relative paths, so the Medusa backend and stored product image URLs do not need to change.

For Cloudflare deploys, use `pnpm cf:deploy` for production and `pnpm cf:deploy:staging` for staging. Staging is configured as the `nemuzoo-staging` worker environment in `wrangler.toml`.

`wrangler.toml` stores non-secret Worker variables for each environment:

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY`
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- `RESEND_TOPIC_ID`
- `RESEND_NEWSLETTER_SEGMENT_ID`
- `RESEND_REGISTERED_USER_SEGMENT_ID`
- `MARKETING_EMAIL_FROM`
- `MARKETING_EMAIL_ALLOWLIST`
- `MARKETING_EMAIL_REQUIRE_ALLOWLIST`

Production leaves `MARKETING_EMAIL_ALLOWLIST` empty and sets `MARKETING_EMAIL_REQUIRE_ALLOWLIST=false` so newsletter subscriptions and confirmation emails are sent normally. Staging sets `MARKETING_EMAIL_REQUIRE_ALLOWLIST=true`; configure the comma-separated allowlist outside git so only test email addresses create/update Resend contacts and receive confirmation emails. Non-allowlisted emails return `{ ok: true }` without Resend side effects.

`RESEND_API_KEY` is a production secret and must be configured in Cloudflare instead of committed to `wrangler.toml`:

```bash
pnpm --filter=@nemuzoo/medusa-storefront exec wrangler secret put RESEND_API_KEY --env=""
pnpm --filter=@nemuzoo/medusa-storefront exec wrangler secret put RESEND_API_KEY --env="staging"
```

The storefront can render without these runtime variables because the public values are also read at build time and the Resend API routes skip their remote call when Resend is not configured.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
