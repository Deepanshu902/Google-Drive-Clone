# Use Node.js base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev"]
