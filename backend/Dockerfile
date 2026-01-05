# use image Node.js 20
FROM node:20-alpine

# Setup folder work
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire code
COPY . .

# Port app
EXPOSE 5001

# Startup command
CMD ["npm", "run", "start:local"]
