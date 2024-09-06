# BUILD
FROM node:18-slim AS builder

WORKDIR /build

COPY package*.json ./
ADD local-pkg ./local-pkg
ADD patches ./patches
ADD .npmrc ./
RUN npm ci --omit=dev --omit=optional --omit=peer
RUN cd node_modules/typescript/lib && rm -rf cs de es fr it ja ko pl pt-br ru tr zh-cn zh-tw
COPY . ./
RUN rm ./config.yaml

# RUN
FROM node:18-slim AS runner

LABEL org.opencontainers.image.description="GraphQL Mesh Gateway"
LABEL org.opencontainers.image.vendor="Bouygues Telecom"

WORKDIR /app

COPY --from=builder --chown=node:node /build /app

ENV DEBUG=$DEBUG
ENV ENDPOINT=$ENDPOINT
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV TS_NODE_FILES=true
ENV TS_NODE_TRANSPILE_ONLY=true
ENV UWS_HTTP_MAX_HEADERS_SIZE=8000

VOLUME /app/plugins
VOLUME /app/resolvers
VOLUME /app/sources
VOLUME /app/transforms

CMD [ "npm", "run", "serve" ]
