# ---- Base Stage ----
FROM oven/bun:1.0 AS base

WORKDIR /app

# Copy package files and install dependencies
COPY bun.lock package.json vite.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public

# Install dependencies with Bun
RUN bun install

# Build the app with Vite
RUN bun run build

# ---- Production Stage ----
FROM nginx:alpine

# Copy build output to Nginx's public directory
COPY --from=base /app/dist /usr/share/nginx/html

# Optional: Copy custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
