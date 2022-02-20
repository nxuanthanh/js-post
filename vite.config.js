// vite.config.js
const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        postDetail: resolve(__dirname, 'postDetail.html'),
        addEditPost: resolve(__dirname, 'addEditPost.html'),
      },
    },
  },
});
