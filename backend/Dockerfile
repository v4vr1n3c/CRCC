# CRCC Backend — Node.js 22+ (uses built-in node:sqlite, no native compilation needed)
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY server.js db.js ./
COPY routes ./routes
COPY middleware ./middleware
RUN mkdir -p /app/db
EXPOSE 3000
CMD ["node", "server.js"]
