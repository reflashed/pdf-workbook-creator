const express = require('express');
const reload = require('reload')
const watch = require('watch');

const utils = require('./utils');
const pdfTemplate = require('./layout.js');

const {
  MOUNTED_DIR,
  CONFIG_PATH,
  INPUT_DIR,
  OUTPUT_DIR,
  PDF_PATH,
  EXPRESS_PORT,
  RELOAD_PORT,
} = require('./constants');

const config = utils.loadConfig(CONFIG_PATH);

// setup web server
const app = express();
app.use(express.static(INPUT_DIR)); // so we can access images, css, etc
app.get('/', (req, res) => {
  const html = pdfTemplate(config);
  res.send(html)
});
app.listen(EXPRESS_PORT, () => console.log(`Express listening on ${EXPRESS_PORT}`));

// hot reloading
reload(app, {
  port: RELOAD_PORT,
}).then((reloadReturned) => {
  // watch for file changes in input files
  watch.watchTree(INPUT_DIR, (f, curr, prev) => {
    reloadReturned.reload(); // reloads user's browser
  });
});
