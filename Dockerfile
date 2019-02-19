FROM nginx:1.13
COPY release /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80