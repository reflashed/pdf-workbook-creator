const fs = require('fs');
const puppeteer = require('puppeteer');
const yaml = require("js-yaml");
const reload = require('reload')
const express = require("express");
const http = require('http');
const pdfTemplate = require('./layouts/layout.js');
const config = yaml.safeLoad(fs.readFileSync('./input/config.yml', 'utf8'));
const data = require('./input/pdf.json');
const images = fs.readdirSync("./input/images");
const html = pdfTemplate(config, images, data);

const options = {
  path: './output/output.pdf',
  printBackground: true,
  width: config.width,
  height: config.height,
};

if (!process.env.production) {
  const app = express();
  app.set('port', 3000)
  app.use(express.static('./input/images'))
  app.get('/', (req, res) => res.send(html))

  // Reload code here
  const server = http.createServer(app)
  reload(app, {
    port: 8000
  }).then(function (reloadReturned) {
    server.listen(app.get('port'), function () {
      console.log('Test Environment on port ' + 3000)
    })
  }).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
  })
}

async function pdfCreate() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(html);
  await page.pdf(options);
  console.log('Created/Updated Pdf in Output');
  await browser.close();
}

pdfCreate();