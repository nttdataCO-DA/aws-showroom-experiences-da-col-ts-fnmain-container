# Use the official Node.js image as base
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

COPY .  ./

RUN npm install
RUN npm run build
#configure git
RUN git config --global user.email "provisioning-portal@idp.com"
RUN git config --global user.name "provisioning-portal"

# Expose any ports the app is listening on
EXPOSE 3000

# Start the app
CMD ["node", "./dist/index.js"]