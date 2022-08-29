FROM nginx:alpine AS base

RUN apk upgrade --update-cache

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY config/ /etc/nginx/config/

# Ensure log directory exists, set permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Ensure tmp directory exists, set permissions
RUN mkdir -p /tmp/nginx && \
    chown -R nginx:nginx /tmp/nginx

# Create pidfile, set permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

FROM base AS development
COPY sites-available/dev.conf /etc/nginx/sites-enabled/classroom-conversation.conf

FROM base AS production
COPY sites-available/prod.conf /etc/nginx/sites-enabled/classroom-conversation.conf

FROM base AS amucloud-prod
COPY sites-available/prod-amucloud.conf /etc/nginx/sites-enabled/classroom-conversation.conf
