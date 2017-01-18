FROM qwikwiz/socotra:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY . /app

# Install app dependencies
RUN npm install



EXPOSE 8080

CMD [ "npm", "start" ]