Build production image with:
```
docker build -t pdf-creator .
```

Build development image with:
```
docker build -t pdf-creator-dev -f Dockerfile.dev .
```

Run the production image with:
```
docker run -v $(pwd)/input/:/app/input -v $(pwd)/output/:/app/output -e "production=true" --rm pdf-creator
```

Run the image with:
```
docker run -v $(pwd):/app/ --rm -e "dev=true" -p 8000:8000 -p 3000:3000 pdf-creator-dev
```
