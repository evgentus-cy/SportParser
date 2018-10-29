'use strict'
let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Article = new Schema({
  url: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  lang: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sportSlug: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  },
  tags:[String],
  __pclass: {
    type: Buffer,
    default : () => {
      const buffer = Buffer.from(new String('App\\Modules\\GlobalDB\\Entities\\Articles'));
      return new mongoose.Types.Buffer(buffer).toObject(0x80);
    },
  }
});

export default mongoose.model('Article', Article, 'GlobalDB_Entity_Articles');