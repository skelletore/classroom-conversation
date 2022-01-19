FROM node:16-alpine AS base

ARG APP_ROOT=/app

WORKDIR $APP_ROOT
COPY package.json yarn.lock ./
COPY ./public ./public
COPY ./src ./src
RUN yarn install --frozen-lockfile

FROM base AS development
COPY jest.config.base.js jest.config.js tsconfig.json ./
CMD ["yarn", "start"]

FROM base AS production
RUN npm install -g serve
RUN yarn build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Run as non-root in production
USER 1000
