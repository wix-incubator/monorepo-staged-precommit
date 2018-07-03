const path = require('path');

module.exports = {
  entry: './src/index.js',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};