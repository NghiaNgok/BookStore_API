FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js runtime image for the final stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the built application and node_modules from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/tsconfig.json ./tsconfig.json
# Copy the prisma directory

# RUN prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]

FROM zricethezav/gitleaks:v8.15.0

# Set the working directory
WORKDIR /app

# Copy the repository to the container
COPY . .

# Define the entrypoint
ENTRYPOINT ["gitleaks"]