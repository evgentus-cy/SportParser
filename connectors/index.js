'use strict';
require('dotenv').config();

const debug = {log: require('debug')('connectors:log'), error: require('debug')('connectors:error')};

const fs = require('fs');
const Promise = require('bluebird');

const connectorsDir = './connectors';
const connectors = [];

(async () => {
  const files = await new Promise((resolve, reject) => {
    fs.readdir(connectorsDir, (err, files) => {
      if (err) reject(err);
      else resolve(files)
    })
  });


  await files.filter((file) => {
    return file.indexOf('.js') > 0 && file.indexOf('index.js') === -1
  }).forEach((file) => {
    debug.log(`Load ${file} connector`);
    connectors.push(require(`./${file}`).default)
  });

  return connectors;
})();


export default connectors