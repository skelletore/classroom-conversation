ARG APP_ROOT=/app
ARG RUN_AS_USER="1000"

FROM node:16-alpine AS base
ARG APP_ROOT

WORKDIR $APP_ROOT
COPY package.json craco.config.js ./
COPY ./public ./public
COPY ./src ./src
RUN yarn install --frozen-lockfile

FROM base AS development
COPY jest.config.base.js jest.config.js tsconfig.json ./
CMD ["yarn", "start"]

FROM base AS production
ARG APP_ROOT \
    RUN_AS_USER

RUN npm install -g serve
RUN yarn build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Run as non-root in production
RUN chown -R $RUN_AS_USER:$RUN_AS_USER $APP_ROOT
# Read-only source code in production
RUN chmod -R 555 "$APP_ROOT/src"

USER $RUN_AS_USER
