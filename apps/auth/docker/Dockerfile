# Development stage
FROM node:16-alpine As development

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Alpine setup for pnpm
RUN apk add --no-cache libc6-compat

# Copy over package manager specific files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm locally
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install

# Copy your source files into the Docker image
COPY . .

# Build the application using pnpm
RUN pnpm run build

# Production stage
FROM node:16-alpine As production

# Set the NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Alpine setup for pnpm
RUN apk add --no-cache libc6-compat

# Copy over package manager specific files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm locally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy the built artifacts from the development stage
COPY --from=development /usr/src/app/dist ./dist

# The CMD instruction should specify the correct path for the specific service
# This should be adapted based on the service, for example, for "auth" service:
CMD ["node", "dist/apps/auth/main"]
