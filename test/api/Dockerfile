
# Use a base image with Node.js
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code to the working directory
COPY . .

# Expose the port on which your API will run
#EXPOSE 5000

# Define the command to start your API
CMD ["npm", "run", "start"]
