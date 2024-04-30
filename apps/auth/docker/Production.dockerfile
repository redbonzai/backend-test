# Base image
FROM node:16-alpine as production

# Set environment to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package*.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built application from the host or build it if needed
COPY dist ./dist

# Command to run the application
CMD ["node", "dist/apps/auth/main.js"]
