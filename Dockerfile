FROM nginx

COPY build /usr/share/nginx/html
COPY nginx-server.template /etc/nginx/templates/default.conf.template
