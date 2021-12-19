const path = require('path');

module.exports = {
  entry: '../server/dist/web/Main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../server/dist/web'),
  }
};
