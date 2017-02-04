var webpackCfg = require('./webpack.config');
var isCI = process.env.CI;

process.env.NODE_ENV = 'test';

module.exports = function(config) {

  var preprocessorTasks = [ 'webpack', 'sourcemap', 'coverage' ];

  var configs = {
    basePath: '',
    browsers: [ 'Chrome' ],
    files:[
      'test/**/*.html',
      'test/**.html',
      'test/loadTest.js',
      {pattern:'test/initFrame.js', included:false},
      //'src/**/*.js',
      //'dist/**/*.js'
      //'dist/**/*.js'
    ], 
    port:8000,
    captureTimeout:60000,
    browserNoActivityTimeout:10000,
    singleRun: true,
    frameworks: [ 'mocha', 'chai' ],
    client: {
      mocha: {}
    },
    preprocessors: {
        //'dist/**/*.js': 'coverage',
        'test/loadTest.js': preprocessorTasks,
        'test/initFrame.js': preprocessorTasks
    },
    reporters: [ 'mocha', 'coverage' ],
    webpack: webpackCfg,
    webpackServer: {
          noInfo: true
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text' },
        { type: 'lcov' }
      ]   
    }//,
    //logLevel: config.LOG_DEBUG
  };

  if (isCI) {
  //if (true) {
    configs.browsers = ['PhantomJS'];
    configs.files.push('./node_modules/phantomjs-polyfill/bind-polyfill.js');
    configs.files.push('./node_modules/babel-polyfill/dist/polyfill.js');
  }

  config.set(configs);
};

