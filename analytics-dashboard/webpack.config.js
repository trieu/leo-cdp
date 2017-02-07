var glob = require('glob-all');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: glob.sync([
    'webpack/hot/dev-server', './src/index.js'
    ]),
  output: {
    path: path.join(__dirname),
    filename: 'public/js/bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(), //Assign the module and chunk ids by occurrence count
    new webpack.optimize.DedupePlugin(), //Search for equal or similar files and deduplicate them in the output
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
        query: { presets: ['react','stage-1','es2015'] } //transform with babel-preset-es2015 , babel-preset-react
      }
    ]
  },
  devServer: {
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    },
    hot: true,
    inline: true,
    // https: true,
    port: 3000,
    contentBase: path.resolve(__dirname),
    proxy: {
      '!/**/*.{css,js,hot-update.json}': {
      target: 'http://localhost',
      secure: false
      // changeOrigin: true
      }
    }
  }
};