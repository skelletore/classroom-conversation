FROM nginx:latest as base

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY config/ /etc/nginx/config/

FROM base as development
COPY sites-available/dev.conf /etc/nginx/sites-enabled/classroom-conversation.conf

FROM base as production
COPY sites-available/prod.conf /etc/nginx/sites-enabled/classroom-conversation.conf