# About

PDF Workbook Creator allows you to quickly and easily generate PDFs from html and css pages.

It works by creating a local express server, from which you can preview and edit your PDFs pages.

...

# Running the image

## Building and running from Docker HUb

```
docker run -v $(pwd)/example-volume:/mounted-volume -e "NODE_ENV=production" -e "UID=$(id -u)" -e "GID=$(id -g)" -p 3000:3000 -p 8000:8000 --rm ryanwestfall/pdf-workbook-creator:latest
```

## Building and running locally

```
docker build ./app -t pdf-workbook-creator
docker run -v $(pwd)/example-volume:/mounted-volume -e "NODE_ENV=production" -e "UID=$(id -u)" -e "GID=$(id -g)" -p 3000:3000 -p 8000:8000 --rm pdf-workbook-creator
```

# pdf-workbook-creator

Framework for automating the creation of a "workbook".

The generated workbook contains a table of contents and pages populated with alteranting image and note pages.

The user is expected to supply the data and images for the workbook to be generated.

This is a framework so the user should be able to modify the html and css within reason to their own specifications.

<a href="./src/defaults/output/output.pdf" download>View Sample Pdf Output</a>

# What to know:

The generated workbook contains 3 parts:
* A table of contents page.
* Image pages
* Note pages

Each page has their own html and css defined within **config.yml**.

The table of contents, image and note pages are populated with the data defined within **data.json**.

When editing the html some id attributes are special as they get injected with dynamic data.

These are the special id's:
* "page-dim" - container for the pdf
* "playlist" - the table of contents
* "image" - the current image iterable
* "page-count" - the current page number iterable

# Running the image:

When running the image for the first time, it will generate a **config.yml** file for you along with the default ***input*** and ***output*** directories.

The input directory's structure is easy to understand and follows the logic about the 3 parts of the workbook that's mentioned above.

When running the docker image include a --volume flag mapping the files on your machine to the mount point in the container.

On future runs of the program be sure to include the **config.yml** file at the root of the mount point, as not doing so will generate the default settings potentially writing over your own configurations.

# Production:
### Run the production image with:
```
docker run  -v $(pwd):/app/src/mount/ --rm --user "$(id -u):$(id -g)" ryanwestfall/pdf-workbook-creator:latest
```
# Development:
#### When running in development:
* The container will continously run until manually exited
* An express app will run on localhost:3000
* Hot reloading will be enabled on the express app and the outputted pdf file

### Run the development image with:
```
docker run  -v $(pwd):/app/src/mount/ --rm -e "dev=true" -p 8000:8000 -p 3000:3000 --user "$(id -u):$(id -g)" ryanwestfall/pdf-workbook-creator:latest
```
