const fs = require('fs');

const express = require('express');
const reload = require('reload')
const watch = require('watch');

const utils = require('./utils');

const {
  VIEWS_DIR,
  CONFIG_PATH,
  MOUNTED_DIR,
  INPUT_DIR,
  OUTPUT_DIR,
  PDF_PATH,
  EXPRESS_PORT,
  RELOAD_PORT,
  UID,
  GID,
  NODE_ENV,
} = require('./constants');

/*
 * Validation
 */
if (!fs.existsSync(MOUNTED_DIR)) {
  console.log(`You must mount a volume to ${MOUNTED_DIR} to use this tool. Exiting...`);
  process.exit(1);
}

if (!fs.existsSync(CONFIG_PATH)) {
  console.log(`I can't find your config file at ${CONFIG_PATH}. Exiting...`);
  process.exit(1);
}

// make output dir if there isn't one
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
  fs.chownSync(OUTPUT_DIR, UID, GID);
}

/*
 * App
 */
const app = express(); // serves web pages

app.use(express.static(VIEWS_DIR)); // so we can access images, css, etc from the Dockerfile
app.use(express.static(INPUT_DIR)); // so we can access images, css, etc from the mounted volume

app.set('view engine', 'pug') // so we can template and inject html
app.locals.basedir = '/'; // use absolute paths in express for pug includes

app.get('/', (req, res) => {
  // reload config each time, so we get live reloads when we change config
  const config = utils.loadConfig(CONFIG_PATH);

  res.render('/app/src/views/index', {
    config,
    include: utils.renderPug(INPUT_DIR, config.global_data),
  });
});

app.listen(EXPRESS_PORT, () => console.log(`Express listening on ${EXPRESS_PORT}`));

// hot reloading
reload(app, {
  port: RELOAD_PORT,
}).then((reloadReturned) => {
  // watch for file changes in input files
  watch.watchTree(INPUT_DIR, (f, curr, prev) => {
    const config = utils.loadConfig(CONFIG_PATH); // reload config here as well for hot reloads in case config changes

    reloadReturned.reload(); // reloads user's browser

    utils.exportPdf(
      `http://localhost:${EXPRESS_PORT}`,
      PDF_PATH,
      config.size.width,
      config.size.height,
      UID,
      GID,
    ); // export pdf
  });
});
