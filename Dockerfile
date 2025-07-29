# Step 1: Use full Node image, not Alpine or Slim
FROM node:20 AS builder

WORKDIR /app

# Step 2: Install build deps
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Step 3: Copy only package files first
COPY package*.json ./

# Step 4: Install all deps
RUN npm install

# Step 5: Copy rest of the code
COPY . .

# Step 6: Build app
RUN npm run build

# Step 7: Production image
FROM node:20

WORKDIR /app

# Step 8: Only install production deps
COPY package*.json ./
RUN npm install --omit=dev

# Step 9: Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

# Step 10: Create non-root user
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nodejs
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]
