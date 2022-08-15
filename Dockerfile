FROM nginx

COPY build /usr/share/nginx/html
COPY nginx-server.conf /etc/nginx/conf.d/default.conf
