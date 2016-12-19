
var isCI = process.env.CI;

process.env.NODE_ENV = 'test';

module.exports = function(config) {

  var configs = {
    basePath: '',
    browsers: [ 'Chrome' ],
    files:[
      'test/**/*.html',
      'test/**.html',
      //'src/**/*.js',
      //'dist/**/*.js'
      {pattern:'dist/**/*.js', include:false}
    ], 
    port:8000,
    captureTimeout:60000,
    browserNoActivityTimeout:10000,
    frameworks: [ 'mocha', 'chai' ],
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
    }   
  };

  if (isCI) {
  //if (true) {
    configs.browsers = ['PhantomJS'];
    configs.files.push('./node_modules/phantomjs-polyfill/bind-polyfill.js');
  }

  config.set(configs);
};

