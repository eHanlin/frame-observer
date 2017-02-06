var path = require('path');
var entry = ['./src/js/index'];

if (process.env.NODE_ENV === undefined) {
  entry.unshift('webpack/hot/only-dev-server');
  entry.unshift('webpack-dev-server/client?http://localhost:8080');
}

console.log(path.join(__dirname, 'src'));
module.exports = { 
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget:'umd',
    library:'frameObserver',
    filename: 'frameObserver.js'
  },  
  plugins: [

  ],  
  module: {
    rules: [
      {  
        test: /\.js$/,
        loaders: [ 'babel-loader' ],
        exclude: /node_modules/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'test')
        ]
      }
    ] 
  }   
}    

