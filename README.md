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
docker run -v $(pwd)/input/:/app/input -v $(pwd)/output/:/app/output --rm pdf-creator
```

Run the image with:
```
docker run -v $(pwd):/app/ --rm pdf-creator-dev
```
