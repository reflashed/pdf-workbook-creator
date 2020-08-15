const fs = require('fs');

const yaml = require('js-yaml');
const puppeteer = require('puppeteer');
const pug = require('pug');

const utils = {};

utils.loadConfig = (configPath) => {
  if (!fs.existsSync(configPath)) {
    console.log(`${configPath} missing. Exiting...`);
    process.exit(1);
  }

  return yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
};

utils.exportPdf = async function(url, pdfPath, width, height, uid, gid) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto(url);
  await page.addStyleTag({content: '.page-container { border: 0px !important; }'})

  const pdfOptions = {
    path: pdfPath,
    printBackground: true,
    width,
    height,
  };

  await page.pdf(pdfOptions);
  fs.chownSync(pdfPath, uid, gid);
  console.log(`Created PDF at ${pdfPath} from ${url}`);

  await browser.close();
};

// bc pug doesn't allow dyanmic includes:
//   https://stackoverflow.com/questions/45824697/workaround-to-dynamic-includes-in-pug-jade
utils.renderPug = (rootDir, globalData) => {
  // We can't use path.join from pug out of the box (this fxn will execute in express's pug engine), so add a trailing slash in plain js
  let prefix = rootDir;
  if (prefix.substr(-1) !== '/') prefix += '/';

  const options = {
    global: {},
    local: {},
    index: -1,
  };

  // See if they added a json file instead of passing vars directly directly in the config
  if (typeof globalData == 'string') {
    const globalDataPath = prefix + globalData;
    options.global = loadOptionsFromFile(globalDataPath);
  }

  return (path, localData = {}, index) => {
    // See if they added a json file instead of passing vars directly directly in the config
    if (typeof localData == 'string') {
      const localDataPath = prefix + localData;
      localData = loadOptionsFromFile(localDataPath);
    }

    options.local = localData;
    options.index = index;

    return pug.renderFile(prefix + path, options);
  };
};

// Helper for 'renderPug' fxn to load json, yml, etc data into pug render method
function loadOptionsFromFile(optionsPath) {
  if (!optionsPath) return {};

  let options;

  if (!fs.existsSync(optionsPath)) {
    console.log(`${options} missing. Exiting...`);
    process.exit(1);
  }

  const fileContents = fs.readFileSync(optionsPath, 'utf8');

  const split = optionsPath.split('.');
  const ext = split[split.length - 1];

  // should be easy to extend to other data types
  if (ext == 'json') {
    options = JSON.parse(fileContents);
  } else if (ext == 'yaml' || ext == 'yml') {
    options = yaml.safeLoad(fileContents);
  }else {
    console.log(`I cannot parse ${ext} files. Exiting...`);
    process.exit(1);
  }

  return options;
}

module.exports = utils;
