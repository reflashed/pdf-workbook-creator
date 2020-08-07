### Production:
Build production image with:
```
docker build -t pdf-workbook-creator .
```
Run the production image with:
```
docker run -v $(pwd)/input/:/app/input -v $(pwd)/output/:/app/output -e "production=true" --rm pdf-workbook-creator
```

### Development:
Build development image with:
```
docker build -t pdf-creator-dev -f Dockerfile.dev .
```
Install node dependencies:
```
npm install
```
Run the development image with:
```
docker run -v $(pwd):/app/ -v /app/node_modules/ --rm -e "dev=true" -p 8000:8000 -p 3000:3000 pdf-creator-dev
```
