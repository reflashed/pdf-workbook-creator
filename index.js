const fs = require('fs');
const puppeteer = require('puppeteer');
const yaml = require("js-yaml");
const express = require("express");


const pdfTemplate = require('./layouts/layout.js');
const config = yaml.safeLoad(fs.readFileSync('./input/config.yml', 'utf8'));
const data = require('./input/pdf.json');
const { exit } = require('process');

let images = fs.readdirSync("./input/images");
let html = pdfTemplate(config,images,data);

const app = express();
app.use(express.static('./input/images'))
app.listen(3000);
app.get('/', (req, res) => res.send(html))


async function pdfCreate() {
    const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.setContent(html);
    await page.pdf(options);
    console.log('works');
    await browser.close();
}


pdfCreate();


var options = {
    path: './output/output.pdf',
    printBackground: true,

    width: config.width ,            // allowed units: mm, cm, in, px
    height: config.height ,        // allowed units: mm, cm, in, px
    };
    





