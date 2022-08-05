const path = require('path');
const packageName = require('./package.json').name;

module.exports = {
  devServer: {
    port: 10201,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@src': path.resolve(__dirname, 'src'),
        '@pages': path.resolve(__dirname, 'src/pages'),
      }
    },
    output: {
      library: "VueMicroApp2",
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_VueMicroApp2`,
    }
  }
}