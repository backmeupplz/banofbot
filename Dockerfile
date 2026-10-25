FROM node:22.23.4-bookworm-slim
WORKDIR /app
COPY package.json yarn.lock ./
# Only the runtime dependencies: a smaller image exports and starts faster.
# yarn 1 corrupts a cache two installs write at once
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked yarn install --frozen-lockfile --production
COPY . .
ENV NODE_ENV=production
CMD ["node", "app.js"]
