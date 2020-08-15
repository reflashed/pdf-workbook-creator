const path = require('path');

const constants = {};

constants.MOUNTED_DIR = '/mounted-volume';

constants.CONFIG_PATH = path.join(constants.MOUNTED_DIR, 'config.yml');
constants.INPUT_DIR = path.join(constants.MOUNTED_DIR, 'input');
constants.OUTPUT_DIR = path.join(constants.MOUNTED_DIR, 'output');

constants.PDF_PATH = path.join(constants.INPUT_DIR, 'output.pdf');

constants.EXPRESS_PORT = 3000;
constants.RELOAD_PORT = 8000;

module.exports = constants;
