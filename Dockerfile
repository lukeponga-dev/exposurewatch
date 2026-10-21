FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm pkg delete scripts.postinstall 2>/dev/null || true
RUN npm install --ignore-scripts
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm pkg delete scripts.postinstall 2>/dev/null || true
RUN npm install --omit=dev --ignore-scripts
COPY --from=builder /app/build ./build
ENV PORT=3000
EXPOSE 3000
CMD ["node", "build"]
