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
  if (!fs.existsSync('./input/config.yml')) {
    console.log("./input/config.yml missing. Using defualt config.")
    fs.copySync("./example/input/config.yml", "./input/config.yml")
  }
  if(!fs.existsSync('./input/pdf.json')) {
    console.log("./input/pdf.json missing. Using example pdf.json.")
    fs.copySync("./example/input/pdf.json", "./input/pdf.json")
  }
  if(!fs.existsSync('./input/images')) {
    console.log("./input/images missing. Using example images.")
    fs.copySync("./example/input/images", "./input/images")
  }
  if(!fs.existsSync('./layouts/css/layout.css')) {
    console.log("Layout css not specified. Using defualt css.")
    fs.copySync("./layouts/default.css", "./layouts/css/layout.css")
  }
  
    const data = require('./input/pdf.json');
    const images = fs.readdirSync("./input/images");
    config = yaml.safeLoad(fs.readFileSync('./input/config.yml', 'utf8'));

    html = pdfTemplate(config, images, data);
}
catch(err) {
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
app.use(express.static('./layouts/css'))
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
  await page.addStyleTag({path: './layouts/css/layout.css'})
  await page.addStyleTag({content: ".page-dim {border:0px !important}"})


  await page.pdf(options);
  console.log('Created/Updated Pdf in Output');
  await browser.close();

  if (!process.env.dev) {
    exit();
  }
}

pdfCreate();



