

# ---- Base Node ----
FROM --platform=linux/amd64 node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl1.1-compat && apk update

# ---- Turbo build ----
FROM base AS builder
WORKDIR /app
RUN pnpm install -g turbo
COPY . .
RUN pnpx turbo prune --scope=@informatyzacja/db --docker

# ---- Dependencies ----
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS runner
LABEL name="prisma-studio"
WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/out/full .
COPY --from=builder --chown=nextjs:nodejs /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=installer --chown=nextjs:nodejs /app/node_modules ./node_modules/
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

RUN pnpm db:generate

CMD pnpm db:migrate:prod && pnpm db:studio
