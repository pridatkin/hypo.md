FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-alpine AS runtime

RUN apk add --no-cache tini

ENV NODE_ENV=production \
    PORT=3000 \
    NOTES_DIR=/app/notes

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./
COPY server.js ./
COPY src ./src

RUN mkdir -p /app/notes \
 && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
