FROM node:22-alpine AS base

LABEL maintainer="WebResto"
LABEL org.opencontainers.image.description="Food E-Commerce backend core repository. This project is a backend system for a food delivery service, designed to provide quick deployment and setup of an online platform for ordering and delivering food."

RUN apk add --no-cache \
    python3 \
    bash \
    curl \
    jq \
    ca-certificates && update-ca-certificates

RUN npm i -g @webresto/cli tsx

ARG BRANCH=main
ENV BRANCH=$BRANCH

# Corepack/yarn workaround
RUN corepack enable || true

WORKDIR /app

###################################
#### NPM CACHER - Root Project Dependencies
FROM base AS cacher_modules
RUN apk add git python3 build-base
WORKDIR /app

# Copy all files needed for workspace resolution
COPY . .

# Configure Yarn and install dependencies using lock file
RUN echo "nodeLinker: node-modules" > .yarnrc.yml
RUN yarn set version berry || true
RUN yarn workspaces focus --production
RUN rm -rf ./local_modules

###################################
#### BASE MODULES PREPARE 
FROM base AS cacher_base_modules
RUN apk add --no-cache git build-base  && update-ca-certificates
ENV WEBRESTO_LICENSE=null
WORKDIR /app
COPY . .

RUN sed -i 's/\r$//' /app/.ci/utils/install_webresto_dependencies
RUN bash /app/.ci/utils/install_webresto_dependencies /app/seeds/modules.list /app/modules $WEBRESTO_LICENSE
RUN sed -i 's/\r$//' /app/.ci/utils/bake_admin_frontend
RUN /app/.ci/utils/bake_admin_frontend

###################################
#### WEBRESTO CORE BUILD
FROM base AS cacher_core_build
RUN apk add --no-cache git build-base && update-ca-certificates
WORKDIR /app
COPY . .
# Install dev dependencies for core module and build adminizer
WORKDIR /app/local_modules/core
RUN npm install --include=dev
RUN npm run build:adminizer
WORKDIR /app


###################################
#### TEST
FROM base AS test
RUN apk add --no-cache git build-base
WORKDIR /app
COPY --from=cacher_modules /app/ .
# Dev dependencies (mocha, ts-node, typescript, chai) are not in --production install
# so we install them on top with npm
RUN npm install --ignore-scripts \
    mocha \
    ts-node \
    typescript \
    chai \
    dotenv \
    @types/mocha \
    @types/chai \
    @types/node
RUN NODE_ENV=test \
    TS_NODE_SKIP_IGNORE=true \
    TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","esModuleInterop":true}' \
    ./node_modules/.bin/mocha \
    -r ts-node/register/transpile-only \
    "tests/mcp.test.ts" \
    --exit


###################################
#### RELEASE
FROM base AS release
# Ensure tests passed before building release image
COPY --from=test /app/tests ./tests
WORKDIR /app


EXPOSE 8080

ARG BRANCH=main
ENV BRANCH=$BRANCH

ARG STAGING=0
ENV STAGING=$STAGING

ARG COMMIT_HASH
ENV COMMIT_HASH=$COMMIT_HASH

ARG CONTAINER_VERSION=
ENV CONTAINER_VERSION=$CONTAINER_VERSION

RUN apk add --no-cache nginx
RUN npm i -g pm2 tsx typescript
COPY .ci/config/nginx.conf /etc/nginx/nginx.conf
COPY .ci/config/maintenance.html /var/lib/html/maintenance.html

ENV WEBRESTO_MODULES_PATH=/app/modules

WORKDIR /app
COPY --from=cacher_modules /app/ .
COPY --from=cacher_base_modules /app/modules ./seeds/modules
COPY --from=cacher_core_build /app/local_modules/core/assets ./node_modules/@webresto/core/assets

RUN rm -rf ./.sailsrc && cp ./.sailsrc.default .sailsrc
ADD ./assets ./.tmp/public/
RUN yarn set version berry


RUN rm -rf index.ejs && mv /app/views/maintenance.ejs /app/views/index.ejs
RUN sed -i 's/\r$//' /app/.ci/bootstrap
RUN sed -i 's/\r$//' /app/.ci/utils/set_env
ENTRYPOINT ["/bin/bash","/app/.ci/bootstrap"]
CMD ["start"]
