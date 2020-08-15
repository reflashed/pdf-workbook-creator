const path = require('path');

const constants = {};

// app
constants.APP_DIR = '/app';

constants.SRC_DIR = path.join(constants.APP_DIR, 'src');
constants.VIEWS_DIR = path.join(constants.SRC_DIR, 'views');

// mounted
constants.MOUNTED_DIR = '/mounted-volume';

constants.INPUT_DIR = path.join(constants.MOUNTED_DIR, 'input');
constants.OUTPUT_DIR = path.join(constants.MOUNTED_DIR, 'output');

constants.CONFIG_PATH = path.join(constants.INPUT_DIR, 'config.yml');
constants.PDF_PATH = path.join(constants.OUTPUT_DIR, 'output.pdf');

// ports
constants.EXPRESS_PORT = 3000;
constants.RELOAD_PORT = 8000;

// UID / GID
constants.UID = parseInt(process.env['UID'], 10);
constants.GID = parseInt(process.env['GID'], 10);

constants.NODE_ENV = process.env['NODE_ENV'];

module.exports = constants;
