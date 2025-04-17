# syntax=docker/dockerfile:1

# Builder stage: install dependencies and compile TypeScript
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage: only production deps and compiled output
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy compiled code
COPY --from=builder /app/dist ./dist
# Copy data files for CSV
COPY --from=builder /app/data ./data

# Use non-root user
USER node

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Start the server
CMD ["node", "dist/server.js"]