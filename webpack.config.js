var path = require('path');
var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  // keep the published bundle ES5 like previous releases
  target: ['web', 'es5'],
  entry: './src/js/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'frameObserver.js',
    library: {
      name: 'frameObserver',
      type: 'umd'
    },
    globalObject: 'this'
  },
  optimization: {
    // previous releases shipped an unminified bundle
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [path.join(__dirname, 'src')]
      }
    ]
  }
};
