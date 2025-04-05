# DSQR Website

A website built with React, Vite, and Tailwind CSS, using a monorepo structure with shadcn/ui components.

## Building with Nix

This project can be built and containerized using Nix, which provides better reproducibility and build consistency:

### Building the Docker image

```bash
# Build the Docker image for your current architecture
nix build .#container

# Load the image into Docker
docker load < result

# Tag for your registry (optional)
docker tag dsqr-website:latest dennda/dsqr-website:latest

# Push to registry
docker push dennda/dsqr-website:latest
```

### Multi-Architecture Support with Nix + Docker

For multi-architecture builds (similar to the previous Docker buildx approach):

```bash
# On an x86_64 system
nix build .#container
docker load < result
docker tag dsqr-website:latest dennda/dsqr-website:amd64

# On an ARM64 system (like M1/M2 Mac)
nix build .#container
docker load < result
docker tag dsqr-website:latest dennda/dsqr-website:arm64

# Push both images
docker push dennda/dsqr-website:amd64
docker push dennda/dsqr-website:arm64

# Create and push a multi-architecture manifest
docker manifest create dennda/dsqr-website:latest \
  dennda/dsqr-website:amd64 \
  dennda/dsqr-website:arm64
  
docker manifest push dennda/dsqr-website:latest
```

### Development Environment

```bash
# Enter the development shell which includes all necessary tools
nix develop
```

## Traditional Docker Build

Alternatively, you can build using Docker directly:

```bash
# Build multi-architecture image
docker buildx build --platform linux/amd64,linux/arm64 -t dennda/dsqr-website:latest --push .
```

## Deploying to Kubernetes

After building and pushing your image:

```bash
# Restart the Kubernetes deployment to pick up changes
kubectl rollout restart deployment/dsqr-website-website -n websites

# Check rollout status
kubectl rollout status deployment/dsqr-website-website -n websites
```

## Component Usage

To use the components from the UI package:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Adding shadcn/ui Components

To add more components to your app:

```bash
pnpm dlx shadcn@latest add button -c apps/website
```

This will place the UI components in the `packages/ui/src/components` directory.
