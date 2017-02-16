var path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "sourcemap",
  devServer: {
    compress: true,
    port: 9000
  }
};