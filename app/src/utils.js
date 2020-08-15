const fs = require('fs-extra');
const yaml = require('js-yaml');
const puppeteer = require('puppeteer');

const utils = {};

utils.loadConfig = (configPath) => {
  if (!fs.existsSync(configPath)) {
    console.log(`${configPath} missing. Exiting...`);
    exit(1);
  }

  return yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
};

utils.createPdf = async function() {
  const pdfOptions = {
    path: PDF_PATH,
    printBackground: true,
    width: config.size.width,
    height: config.size.height,
  };

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
};

module.exports = utils;
