# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy workspace packages
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm build

# Build API
WORKDIR /app/apps/api
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm for running prisma commands
RUN npm install -g pnpm

# Copy package files for production install
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/api/package.json ./apps/api/

# Copy built shared package
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy built API
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy Prisma files for migrations
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Copy seed script
COPY --from=builder /app/apps/api/scripts ./apps/api/scripts

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client in production
WORKDIR /app/apps/api
RUN npx prisma generate

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start script that runs migrations then starts server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
