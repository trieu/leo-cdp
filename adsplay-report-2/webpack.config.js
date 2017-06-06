var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var cssnext = require('postcss-cssnext');
// var postcssFocus = require('postcss-focus');
// var postcssReporter = require('postcss-reporter');
// var autoprefixer = require('autoprefixer');
module.exports = {
    entry: {
        //core plugin
        vendor: [
            'react',
            'react-dom',
        ],
        bundle: [
            './src/index.js',
        ],
    },

    output: {
        path: path.join(__dirname, 'public'),
        filename: 'js/[name].js'
    },

    resolve: {
        alias: {'~': path.resolve(__dirname)},
        extensions: ['', '.js', '.jsx'],
        modules: [
            'src',
            'node_modules',
        ],
    },

    module: {
        loaders: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1" , "sass-loader"),
            }, 
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1")
            },
            {
                test: /\.jsx*$/,
                exclude: [/node_modules/, /.+\.config.js/],
                loader: 'babel',
                include: path.join(__dirname, 'src')
            },
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new ExtractTextPlugin('css/style-react.css', {
            allChunks: true
        }),
        new webpack.optimize.DedupePlugin(), //Search for equal or similar files and deduplicate them in the output
        new webpack.optimize.OccurenceOrderPlugin(), //Assign the module and chunk ids by occurrence count
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {warnings: false} //disable message warnings
        }), //Minimize all JavaScript output of chunks
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
};
