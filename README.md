Build image with:
```
docker build -t pdf-creator .
```

Run the production image with:
```
docker run -v $(pwd)/input/:/app/input -v $(pwd)/output/:/app/output --rm -e "production=true" pdf-creator
```
