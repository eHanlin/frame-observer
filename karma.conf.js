
var isCI = process.env.CI;

process.env.NODE_ENV = 'test';

module.exports = function(config) {

  var configs = {
    basePath: '',
    browsers: [ 'Chrome' ],
    files:[
      'test/**/*.html',
      'test/**.html',
      'test/**.js',
      //'src/**/*.js',
      //'dist/**/*.js'
      'dist/**/*.js'
    ], 
    port:8000,
    captureTimeout:60000,
    browserNoActivityTimeout:10000,
    frameworks: [ 'mocha', 'chai' ],
    preprocessors: {
        'dist/**/*.js': 'coverage'
    },
    client: {
      mocha: {}
    },
    singleRun: true,
    reporters: [ 'mocha', 'coverage' ],
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

