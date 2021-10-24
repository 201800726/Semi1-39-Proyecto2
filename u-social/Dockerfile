# Stage 1
FROM node:14-alpine as build

RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/u-social /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]