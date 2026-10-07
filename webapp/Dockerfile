FROM node:22-alpine AS build

WORKDIR /app
COPY webapp/package.json webapp/package-lock.json ./
RUN npm ci
COPY webapp/ ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine AS runtime
COPY webapp/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
