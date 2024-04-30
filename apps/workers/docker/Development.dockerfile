# Base image
FROM node:20-alpine as development
# Alpine setup for pnpm
RUN apk add --no-cache libc6-compat
RUN npm install -g nodemon pnpm

# Set working directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

## RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Print Node, npm, and pnpm versions
RUN node --version
RUN npm --version
RUN pnpm --version

# Print global packages
RUN npm list -g --depth=0

# Command to run the application
CMD ["node", "dist/apps/workers/main"]
