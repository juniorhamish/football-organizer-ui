FROM nginx

COPY nginx-server.template /etc/nginx/templates/default.conf.template
COPY build /usr/share/nginx/html
