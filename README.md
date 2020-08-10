# pdf-workbook-creator

Framework for automating the creation of a "workbook".

The generated workbook contains a table of contents and pages populated with images.

The user is expected to supply the data and images for the workbook to be generated.

This is a framework so the user should be able to modify the css and layout within reason to their own specifications.

<a href="./src/example/output/output.pdf" download>Download Sample Pdf Output</a>

# Production:

## To run the image:
You must have an **Input** directory on *your* machine that contains:
* A correctly formatted ***config.yml*** file.
* A correctly formatted ***pdf.json*** file.
* An ***images*** directory filled with images wanted in the workbook.

Preferably also include an output directory for the docker container to mount to

The repo comes with an example on how to format these files.

---

Run the production image with:
```
docker run -v $(pwd)/input/:/app/src/input -v $(pwd)/output/:/app/src/output --rm ryanwestfall/pdf-workbook-creator:latest
```

# Development:

#### When running in development:
* The container will continously run until manually exited
* An express app will run on localhost:3000
* Hot reloading will be enabled on the express app and the outputted pdf file

### You must pass the an environemnet variable "dev=true" to use the developemet tools
Run the development image with:
```
docker run  -v $(pwd)/input/:/app/src/input -v $(pwd)/output/:/app/src/output  -v $(pwd)/:/app/src/layouts/css/ --rm -e "dev=true" -p 8000:8000 -p 3000:3000 ryanwestfall/pdf-workbook-creator:latest
```

