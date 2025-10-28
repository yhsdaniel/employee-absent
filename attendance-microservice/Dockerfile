# ========= Stage 1: Build =========
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only package files first
COPY package*.json ./
RUN npm install

# Copy everything and build
COPY . .
RUN npm run build


# ========= Stage 2: Run =========
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --only=production

# Default port (can be overridden by docker-compose)
EXPOSE 3002

CMD ["node", "dist/main.js"]