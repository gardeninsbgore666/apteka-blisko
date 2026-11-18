FROM node:22-alpine
WORKDIR /app
COPY package.json ./package.json
COPY src/ ./src/
COPY scripts/ ./scripts/
RUN node scripts/download_data.js
EXPOSE 8080
CMD ["node", "src/server.js"]
