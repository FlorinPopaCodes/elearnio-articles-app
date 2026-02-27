# syntax=docker/dockerfile:1
# check=error=true

ARG NODE_VERSION=22

# ---- Build stage ----
FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS final

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built Angular SPA
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy nginx site config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
