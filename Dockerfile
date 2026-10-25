FROM node:22.23.4-bookworm-slim
WORKDIR /app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn yarn install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
CMD ["node", "app.js"]
