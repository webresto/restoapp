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

# TODO: delete after release
ENV STAGING=1

# Corepack/yarn workaround
RUN corepack enable || true

WORKDIR /app

###################################
#### NPM CACHER - Root Project Dependencies
FROM base AS cacher_modules
RUN apk add git python3 build-base
WORKDIR /app
COPY . .
 RUN echo "nodeLinker: node-modules" > .yarnrc.yml
 RUN yarn set version berry || true
 RUN yarn workspaces focus --production

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
#### POSTGRES TEST
# FROM postgres:16-alpine AS test

# ENV POSTGRES_PASSWORD postgres
# ENV POSTGRES_USER postgres
# ENV POSTGRES_DB postgres
# ENV DATASTORE postgres
# ENV PG_HOST localhost
# ENV POSTGRES_BACKUP FALSE

# RUN apk add --no-cache curl bash zip jq nodejs npm

# # RUN npm i -g mocha

# RUN mkdir -p /tmp/test && cd /tmp/test && npm i chai@4.3.6 chai-http@4.4.0 mocha

# WORKDIR /app
# COPY --from=cacher_modules /app/ .
# COPY --from=cacher_base_modules /app/modules ./seeds/modules
# RUN cp -r /tmp/test/node_modules/* /app/node_modules/
# RUN sed -i 's/\r$//' /app/.ci/bootstrap

# RUN bash -c "nohup docker-entrypoint.sh postgres &" && sleep 10 && bash ./.ci/bootstrap test
# RUN rm -rf ./migrations/* .gitmodules .git

###################################
#### RELEASE
FROM base AS release
WORKDIR /app


EXPOSE 8080

ARG BRANCH=main
ENV BRANCH=$BRANCH

ARG STAGING=0
ENV STAGING=$STAGING

ARG COMMIT_HASH
ENV COMMIT_HASH=$COMMIT_HASH

RUN apk add --no-cache nginx
RUN npm i -g pm2 tsx typescript
COPY .ci/config/nginx.conf /etc/nginx/nginx.conf
COPY .ci/config/maintenance.html /var/lib/html/maintenance.html


ENV WEBRESTO_MODULES_PATH=/app/modules

WORKDIR /app
COPY --from=cacher_modules /app/ .
COPY --from=cacher_base_modules /app/modules ./seeds/modules

RUN rm -rf ./.sailsrc && cp ./.sailsrc.default .sailsrc
ADD ./assets ./.tmp/public/
RUN yarn set version berry

RUN sed -i 's/\r$//' /app/.ci/bootstrap
RUN sed -i 's/\r$//' /app/.ci/utils/set_env
ENTRYPOINT ["/bin/bash","/app/.ci/bootstrap"]
CMD ["start"]