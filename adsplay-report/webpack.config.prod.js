var glob = require('glob-all');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  // resolve: {
  //     alias: {
  //         'react': 'preact-compat',
  //         'react-dom': 'preact-compat'
  //     }
  // },
  entry: glob.sync(['./src/index.js']),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(), //Assign the module and chunk ids by occurrence count
    new webpack.optimize.DedupePlugin(), //Search for equal or similar files and deduplicate them in the output
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false} //disable message warnings
    }), //Minimize all JavaScript output of chunks
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
        query: { presets: ['react','stage-1','es2015'] } //transform with babel-preset-es2015 , babel-preset-react
      }
    ]
  }
};