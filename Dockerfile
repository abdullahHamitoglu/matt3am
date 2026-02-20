# Use Node.js 20 slim as the base image for better compatibility with native binaries
FROM node:20-slim AS base

# Build metadata
ARG COMMIT_SHA="unknown"
LABEL org.opencontainers.image.source="https://github.com/abdullahHamitoglu/matt3am-designer"
LABEL org.opencontainers.image.revision="${COMMIT_SHA}"

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update && apt-get install -y libc6 python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install pnpm for the build step
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set environment variables for the build
ARG PAYLOAD_SECRET
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DOCKER true
ENV SKIP_ENV_VALIDATION true
# Set a dummy DATABASE_URI for build time (won't actually connect)
ENV DATABASE_URI=mongodb://localhost:27017/dummy_build_db
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Generate Payload types and build the app
# Note: We use a dummy DATABASE_URI during build
# The app will connect to the real DB at runtime instead
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy public files from builder (they were copied there in COPY . .)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001

ENV PORT 3001
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://localhost:3001/api/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
