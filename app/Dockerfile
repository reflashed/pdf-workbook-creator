FROM buildkite/puppeteer

WORKDIR /cache
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /app
COPY . ./

EXPOSE 3000
EXPOSE 8000

# https://stackoverflow.com/questions/30052019/docker-creates-files-as-root-in-mounted-volume
RUN useradd -d /home/pdf-creator -m -s /bin/bash pdf-creator && echo "pdf-creator:pdf-creator" | chpasswd && adduser pdf-creator sudo

# make sure our new user owns all the files before switching to the new user (must be root)
RUN chown -R pdf-creator:pdf-creator /cache
RUN chown -R pdf-creator:pdf-creator /app
RUN chown -R pdf-creator:pdf-creator /mounted-volume

# so our new pdfs won't be root
USER pdf-creator

CMD ["bash", "start-service.sh"]
