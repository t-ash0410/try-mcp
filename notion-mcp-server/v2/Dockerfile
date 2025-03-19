# Note:
#
# It is recommended to execute the following command in the `notion-mcp-server/v2` directory.
# ```
# ❯ docker buildx build -t notion-mcp-server-v2 -f Dockerfile .
# ```

FROM oven/bun:alpine AS installer

WORKDIR /usr/src/app

COPY bun.lock     ./
COPY package.json ./

RUN bun install -p --frozen-lockfile

# -----

FROM oven/bun:distroless AS runner

COPY --from=installer /usr/src/app/node_modules ./node_modules

COPY src           src
COPY package.json  package.json
COPY tsconfig.json tsconfig.json

CMD ["src/app.ts"]
