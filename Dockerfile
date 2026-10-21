FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/build ./build
ENV PORT=3000
EXPOSE 3000
CMD ["node", "build"]
