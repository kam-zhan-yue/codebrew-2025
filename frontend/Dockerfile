# ---- Base Stage ----
FROM oven/bun:1.0 AS base

WORKDIR /app

# ---- Development Stage ----
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

EXPOSE 5173

CMD ["bun", "run", "dev"]

# EXPOSE 5173

# Build the app with Vite
# RUN bun run build

# ---- Production Stage ----
# FROM nginx:alpine

# # Copy build output to Nginx's public directory
# COPY --from=base /app/dist /usr/share/nginx/html

# # Optional: Copy custom nginx config
# # COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
