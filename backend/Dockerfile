# Use a lightweight base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only dependency-related files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
