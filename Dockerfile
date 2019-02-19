FROM nginx:1.13
COPY dist/unblock-ui /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80