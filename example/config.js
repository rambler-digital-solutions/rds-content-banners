'use strict';

var webpack = require('webpack');

module.exports = {
  entry: {
    application: './example/index.js'
  },

  output: {
    path: __dirname + '/output',
    filename: '[name].js'
  }
};
