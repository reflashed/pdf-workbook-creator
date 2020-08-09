const fs = require('fs');
const puppeteer = require('puppeteer');
const yaml = require("js-yaml");
const reload = require('reload')
const express = require("express");
const http = require('http');
const pdfTemplate = require('./layouts/layout.js');
const {  exit  } = require('process');
const config = yaml.safeLoad(fs.readFileSync('./input/config.yml', 'utf8'));

let html;

try {
const data = require('./input/pdf.json');
const images = fs.readdirSync("./input/images");
html = pdfTemplate(config, images, data);
}
catch(err) {
  console.log("Missing from input: pdf.json or images directory");
  console.log(err);
  exit(1);
}

const options = {
  path: './output/output.pdf',
  printBackground: true,
  width: config.width,
  height: config.height,
};

const app = express();
app.set('port', 3000)
app.use(express.static('./input/images'))
app.use(express.static('./layouts'))
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
  await page.addStyleTag({path: './layouts/layout.css'})
  await page.addStyleTag({content: ".page-dim {border:0px !important}"})


  await page.pdf(options);
  console.log('Created/Updated Pdf in Output');
  await browser.close();

  if (!process.env.dev) {
    exit();
  }
}

pdfCreate();



