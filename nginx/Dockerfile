FROM nginx:latest as base

COPY nginx.conf /etc/nginx/nginx.conf

# configs
COPY config/general.conf /etc/nginx/config/general.conf
COPY config/security.conf /etc/nginx/config/security.conf
COPY config/proxy.conf /etc/nginx/config/proxy.conf

FROM base as development
COPY sites-available/dev.conf /etc/nginx/sites-enabled/classroom-conversation.conf

FROM base as production
COPY sites-available/prod.conf /etc/nginx/sites-enabled/classroom-conversation.conf