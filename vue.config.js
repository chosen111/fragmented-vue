var path = require('path');

process.env.VUE_APP_STATIC = path.resolve(__dirname, 'src/assets');

module.exports = {
  configureWebpack: {
    resolve: {
      modules: [ path.resolve(__dirname, 'node_modules') ],
      alias: {
        'assets': path.resolve(__dirname, 'src/assets'),
      }
    },
  }, 
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        includePaths: [
          path.resolve(__dirname, 'src/assets/scss')
        ],
        data: '@import "_vars.scss";'
      },
    }
  },
  devServer: {
    proxy: 'http://localhost:5000'
  },
}
