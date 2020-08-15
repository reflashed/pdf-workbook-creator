const express = require('express');
const reload = require('reload')
const watch = require('watch');

const utils = require('./utils');

const {
  VIEWS_DIR,
  CONFIG_PATH,
  INPUT_DIR,
  PDF_PATH,
  EXPRESS_PORT,
  RELOAD_PORT,
} = require('./constants');

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
    ); // export pdf
  });
});
