# Use Node.js LTS as the base image
FROM node:18-alpine AS base

# Install system dependencies for sharp
RUN apk add --no-cache vips-dev build-base

# Create app directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
# Use npm install instead of npm ci to work without package-lock.json
RUN npm install

# Build the app
FROM deps AS builder
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/content && chown -R nextjs:nodejs /app/content

# Copy package.json and install production dependencies (including sharp)
COPY package.json ./
RUN npm install --only=production

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create default content directories with sample files
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
