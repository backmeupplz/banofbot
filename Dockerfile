FROM node:22.23.5-bookworm-slim@sha256:be979e5523c76fa4d5ca4ebd3099078f220aa47ec39c48ad5b5df9314debd6eb
WORKDIR /app
COPY package.json yarn.lock ./
# Only the runtime dependencies: a smaller image exports and starts faster.
# yarn 1 corrupts a cache two installs write at once
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked yarn install --frozen-lockfile --production
# The runtime only runs node; the npm bundled with node 22 carries CVEs Renovate can't bump, so drop it
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY . .
ENV NODE_ENV=production
CMD ["node", "app.js"]
