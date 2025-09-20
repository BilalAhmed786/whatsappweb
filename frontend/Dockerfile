# Step 1: Build the frontend app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:latest

# Copy only the built dist folder
COPY --from=build /app/dist /usr/share/nginx/html

# Custom Nginx config (optional)
COPY nginx.config /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
