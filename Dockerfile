# Build Stage
FROM node:22-slim AS build

WORKDIR /app

# Set up PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Copy all package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages/
COPY apps ./apps/

# Install all dependencies including dev dependencies
RUN pnpm install

# Add missing packages explicitly
RUN pnpm add -w tailwindcss-animate

# Copy all source code
COPY . .

# Build the app using Turbo
RUN pnpm turbo build --filter=website...

# Use node for a simple production image
FROM node:22-alpine

WORKDIR /app

# Copy only the built dist directory
COPY --from=build /app/apps/website/dist /app/dist

# Install serve to serve static files
RUN npm install -g serve@14.2.1

# Expose port
EXPOSE 3000

# Serve static files
CMD ["serve", "-s", "dist", "-l", "3000"]