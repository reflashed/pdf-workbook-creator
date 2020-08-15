FROM buildkite/puppeteer

WORKDIR /cache
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /app
COPY . ./

EXPOSE 3000
# Do we actually have to expose 8000 or can it run inside the container w/o being exposed?
EXPOSE 8000

CMD ["bash", "start-service.sh"]
