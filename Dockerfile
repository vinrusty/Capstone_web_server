# Use official Node.js image as base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3001 (or any other port your Express app listens on)
EXPOSE 3001

# Command to run the application
CMD ["node", "index.js"]
