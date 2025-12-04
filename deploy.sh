#!/bin/bash
# Stop the app
pm2 stop frontend || true

# Install production dependencies
npm ci --omit=dev

# Generate Prisma Client
npx prisma generate

# Start the app
pm2 start frontend || pm2 start npm --name "frontend" -- start
