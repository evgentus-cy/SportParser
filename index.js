'use strict';
require('dotenv').config();

const debug = {log: require('debug')('app:log'), error: require('debug')('app:error')};

import mongoose from 'mongoose';
import proxy from './lib/proxy';

import grabbers from  './grabbers';

process.on('unhandledRejection', function(err, promise) {
  debug.error(`Unhandled rejection (promise: ${promise}, reason: ${err}).`);
});

process.on('uncaughtException', function(err) {
  debug.error(`Unhandled exeption (reason: ${err}).`);
});

mongoose.connect(process.env.MONGO_DSN, { useNewUrlParser: true }, function (err) {

  if (err) throw err;

  (async () => {
    await proxy.resolveProxy();

    grabbers.forEach(async (grabber) => {
      setInterval(async function () {
        await grabber.loadSources();
        debug.log(`Getting RSS: ${grabber.getName()}`)
      }, process.env.GRABBER_UPDATE_INTERVAL);
      await grabber.loadSources();
    });

  })();
});