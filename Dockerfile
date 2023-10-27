# Use a minimal Node.js base image (e.g., alpine)
FROM node:14-alpine as builder

# Set a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if needed)
# RUN npm run build

# Use a separate production-ready image
FROM node:14-alpine

# Set a working directory in the container
WORKDIR /app

# Copy only the built application from the builder stage
COPY --from=builder /app .

# Remove development dependencies to reduce image size
RUN npm prune --production

# Set environment variables (if needed)
# ENV NODE_ENV=production
ENV LONG_TOKEN_SECRET="hello"
ENV SHORT_TOKEN_SECRET="hello"
ENV NACL_SECRET="hel"
ENV AUTH_SERVICE="auth"
ENV SERVICE_NAME="test"
ENV AUTH_PORT="5223"
ENV TWILIO_ACCOUNT_VERIFY_SID="MG24a8e55b4360c8e065b6d058ef1baa67"
ENV TWILIO_ACCOUNT_SID="ACd3c36a17181833d4c8111949e4471e6c"
ENV TWILIO_TOKEN="8614cdb827aa017c395e3090ee1bbabc"
ENV MONGO_URI="mongodb+srv://mo:18sHaAoRuTOiIAG0@cluster0.mkzmq.mongodb.net"
ENV CACHE_REDIS="redis://default:1PuUjjoumSZRDO39ukgHFsYc067xyCqn@redis-13533.c17.us-east-1-4.ec2.cloud.redislabs.com:13533"

# Expose the application port (if your app listens on a specific port)
# EXPOSE 8080

# Define the command to start your application
CMD [ "node", "app.js" ]
