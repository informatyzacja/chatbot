
# ---- Base Node ----
FROM --platform=linux/amd64 node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl1.1-compat && apk update

# ---- Turbo build ----
FROM base AS builder
WORKDIR /app
RUN pnpm install -g turbo
COPY . . 
RUN pnpx turbo prune --scope=@informatyzacja/admin --docker

# ---- Dependencies ----
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

ENV NODE_ENV production
ENV CI         true
ENV SKIP_ENV_VALIDATION true

COPY .gitignore .gitignore 
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/out/json .
COPY --from=builder /app/out/pnpm-lock.yaml\* ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=builder /app/out/full .

RUN pnpm build --filter=@informatyzacja/admin

FROM base AS runner
LABEL name="admin"
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
EXPOSE 3000
ENV PORT 3000

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1 Optional

COPY --from=installer /app/apps/admin/next.config.mjs ./
COPY --from=installer /app/apps/admin/package.json ./
COPY --from=installer /app/packages/db ./packages/db

COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public


CMD node apps/admin/server.js