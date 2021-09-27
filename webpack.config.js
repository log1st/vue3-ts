const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
