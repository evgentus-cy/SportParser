'use strict';
require('dotenv').config();

const debug = {log: require('debug')('grabbers:log'), error: require('debug')('grabbers:error')};

const fs = require('fs');
const Promise = require('bluebird');

const grabbersDir = './grabbers';
const grabbers = [];

(async () => {
  const files = await new Promise((resolve, reject) => {
    fs.readdir(grabbersDir, (err, files) => {
      if (err) reject(err);
      else resolve(files)
    })
  });

  await files.filter((file) => {
    return file.indexOf('.js') > 0 && file.indexOf('index.js') === -1
  }).forEach((file) => {
    debug.log(`Load ${file} grabbers`);
    grabbers.push(require(`./${file}`).default)
  });

  return grabbers;
})();

export default grabbers