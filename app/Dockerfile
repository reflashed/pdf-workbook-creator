FROM buildkite/puppeteer

WORKDIR /cache
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /app
COPY . ./

EXPOSE 3000
EXPOSE 8000

CMD ["bash", "start-service.sh"]
