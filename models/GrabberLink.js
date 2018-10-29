'use strict'

let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrabberLinkSchema = new Schema({
  link: {
    type: String,
    required: true,
    unique: true
  },
  site: {
    type: String,
    required: true,
    index: true
  }
});

export default mongoose.model('GrabberLink', GrabberLinkSchema);