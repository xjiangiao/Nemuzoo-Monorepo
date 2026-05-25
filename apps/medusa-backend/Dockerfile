# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

FROM base AS builder
WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/medusa-backend/package.json ./apps/medusa-backend/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=@nemuzoo/medusa-backend

# Copy source
COPY apps/medusa-backend ./apps/medusa-backend

# Build
WORKDIR /app/apps/medusa-backend
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/apps/medusa-backend/.medusa ./apps/medusa-backend/.medusa
COPY --from=builder /app/apps/medusa-backend/package.json ./apps/medusa-backend/
COPY --from=builder /app/apps/medusa-backend/medusa-config.ts ./apps/medusa-backend/
COPY --from=builder /app/apps/medusa-backend/tsconfig.json ./apps/medusa-backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/medusa-backend/node_modules ./apps/medusa-backend/node_modules
COPY --from=builder /app/pnpm-lock.yaml ./

ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

WORKDIR /app/apps/medusa-backend
CMD ["npx", "medusa", "start"]
