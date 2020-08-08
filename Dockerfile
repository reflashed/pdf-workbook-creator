FROM buildkite/puppeteer
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 8000
CMD [ "bash", "run.sh"]