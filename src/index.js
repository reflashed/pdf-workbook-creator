const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const yaml = require("js-yaml");
const reload = require('reload')
const express = require("express");
const http = require('http');
const pdfTemplate = require('./layouts/layout.js');
const {  exit  } = require('process');
let config;
let html;

try {
  if (!fs.existsSync('./mount/config.yml')) {
    console.log("config.yml missing. Using defualt settings.")
    fs.copySync("./defaults/", "./mount/")

  }
    config = yaml.safeLoad(fs.readFileSync('./mount/config.yml', 'utf8'));

    html = pdfTemplate(config);
}
catch(err) {
  console.log(err);
  exit(1);
}

const options = {
  path: './mount/output/output.pdf',
  printBackground: true,
  width: config.size.width,
  height: config.size.height,
};

const app = express();
app.set('port', 3000)
app.use(express.static('./mount/' + config.pages.page_sequence.media))
app.use(express.static( "./mount/"))

app.get('/', (req, res) => res.send(html))

const server = http.createServer(app)
reload(app, {
  port: 8000
}).then(function (reloadReturned) {
  server.listen(app.get('port'), function () {
    console.log("Started test environment at localhost:3000");
  })
})

async function pdfCreate() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(html);
  await page.addStyleTag({path: "./mount/" + config.pages.page.layout_table.css})
  await page.addStyleTag({path: "./mount/" + config.pages.page_sequence.layout_image.css})
  await page.addStyleTag({path: "./mount/" + config.pages.page_sequence.layout_notes.css})
  await page.addStyleTag({content: ".page-dim {border:0px !important}"})

  await page.pdf(options);
  console.log('Created/Updated Pdf in Output');
  await browser.close();

  if (!process.env.dev) {
    exit();
  }
}

pdfCreate();



