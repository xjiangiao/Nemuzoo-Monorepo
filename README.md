# Nemuzoo-Monorepo

## Environment isolation

This repo supports separate production and staging deployments for payment integration safety.

- Production backend: `api.nemuzoo.com` and `admin.nemuzoo.com` -> `medusa-backend` on host port `9000`.
- Staging backend: `api-staging.nemuzoo.com` and `admin-staging.nemuzoo.com` -> `medusa-backend-staging` on host port `9001`.
- Production storefront: `www.nemuzoo.com` -> `https://api.nemuzoo.com`.
- Staging storefront: `staging.nemuzoo.com` -> `https://api-staging.nemuzoo.com`.

Keep these resources separate between environments:

- `DATABASE_URL`
- `REDIS_URL`
- `R2_BUCKET`, `R2_FILE_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- Medusa publishable API keys
- Payment sandbox/live keys and webhook secrets

Use `.env.production.example` and `.env.staging.example` as the backend templates. GitHub Actions deploys `main` with the `production` environment and `staging` with the `staging` environment, so configure separate GitHub Environment secrets and variables for each.
