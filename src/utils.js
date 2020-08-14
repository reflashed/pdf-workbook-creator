const fs = require('fs-extra');
const yaml = require('js-yaml');

const utils = {};

utils.loadConfig = (configPath) => {
  if (!fs.existsSync(configPath)) {
    console.log(`${configPath} missing. Exiting...`);
    exit(1);
  }

  return yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
}

module.exports = utils;
