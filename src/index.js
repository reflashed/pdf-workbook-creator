const path = require('path');

const puppeteer = require('puppeteer');
const express = require('express');
const http = require('http');
const reload = require('reload')
const {  exit  } = require('process');

const utils = require('./utils');
const pdfTemplate = require('./layout.js');

const MOUNTED_DIR = '/mounted-volume';

const CONFIG_PATH = path.join(MOUNTED_DIR, 'config.yml');
const config = utils.loadConfig(CONFIG_PATH);

const INPUT_DIR = path.join(MOUNTED_DIR, 'input');
const OUTPUT_DIR = path.join(MOUNTED_DIR, 'output');

// should change this to use the config file's name
const PDF_PATH = path.join(INPUT_DIR, 'output.pdf');

const EXPRESS_PORT = 3000;
const RELOAD_PORT = 8000;

console.log(config);
const html = pdfTemplate(config);

const options = {
  path: PDF_PATH,
  printBackground: true,
  width: config.size.width,
  height: config.size.height,
};

const app = express();

app.set('port', EXPRESS_PORT)
app.use(express.static('/mounted-volume/' + config.pages.page_sequence.media))
app.use(express.static( '/mounted-volume/'))

app.get('/', (req, res) => res.send(html))

const server = http.createServer(app)

reload(app, {
  port: RELOAD_PORT,
}).then(function (reloadReturned) {
  server.listen(EXPRESS_PORT, function () {
    console.log('Restarting test environment at localhost:3000');
  })
})

async function createPdf() {
  console.log('ah');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(html);
  await page.addStyleTag({path: '/mounted-volume/' + config.pages.page.layout_table.css})
  await page.addStyleTag({path: '/mounted-volume/' + config.pages.page_sequence.layout_image.css})
  await page.addStyleTag({path: '/mounted-volume/' + config.pages.page_sequence.layout_notes.css})
  await page.addStyleTag({content: '.page-dim {border:0px !important}'})

  await page.pdf(options);
  console.log('Created/Updated Pdf in Output');
  await browser.close();

  if (!process.env.dev) {
    exit();
  }
}

createPdf();
