# ==========================
# Stage 1: Base image for node
# ==========================
FROM node:20-alpine AS base
WORKDIR /app

# Install bash and git for dev tasks (optional but useful)
RUN apk add --no-cache bash git curl

# Copy package.json first to leverage caching
COPY package.json package-lock.json ./

# ==========================
# Stage 2: Development image
# ==========================
FROM base AS development

# Install all dependencies including devDependencies
RUN npm install

# Copy all source files
COPY . .

# Set environment variables for development
ENV NODE_ENV=development
ENV NG_CLI_ANALYTICS=ci
ENV PORT=4200

# Expose Angular dev server port
EXPOSE 4200

# Start Angular dev server with host 0.0.0.0 for container access
# Enable source maps for debugging
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

# ==========================
# Stage 3: Production build
# ==========================
FROM base AS build

# Install all dependencies (needed for Angular CLI)
RUN npm install

# Copy all source files
COPY . .

# Build Angular app for production
RUN npm run build -- --configuration production

# ==========================
# Stage 4: Production output
# ==========================
FROM node:20-alpine AS production

WORKDIR /app

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/media-rs-frontend/ /app/dist/

# Expose the port (for NGINX to map or docker-compose)
EXPOSE 4200

# This container just holds the static files; NGINX or another web server will serve them
CMD ["sh", "-c", "tail -f /dev/null"]
