docker build . -t pdf-creator-local && docker run  -v $(pwd):/app/src/mount/ --rm -e "dev=true" -p 8000:8000 -p 3000:3000 --user "$(id -u):$(id -g)" pdf-creator-local
