# --- Build stage ---
FROM node:24-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm install

# Build Astro project
RUN npm run build


# --- Runtime stage ---
FROM node:24-alpine AS runtime

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy only the build output from previous stage
COPY --from=build /app/dist ./dist

# Use non-root user for security
USER node

# Expose the same port you had with nginx
EXPOSE 8080

# Run static file server
CMD node ./dist/server/entry.mjs
