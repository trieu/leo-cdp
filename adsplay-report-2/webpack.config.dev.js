var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
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
            // necessary for hot reloading with IE:
            'eventsource-polyfill',
            // listen to code updates emitted by hot middleware:
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
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
                loader: "style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1!sass-loader",
            }, 
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1",
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
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['public/js/vendor.js', 'public/js/bundle.js','public/css/style-react.css'], {
            root: path.join(__dirname, '/'),
            verbose: true, 
            dry: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                CLIENT: JSON.stringify(true),
                'NODE_ENV': JSON.stringify('development'),
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new ExtractTextPlugin('./css/style-react.css', {
            allChunks: true
        }),
    ],

    //debug: true,
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        publicPath: '/',
        contentBase: path.resolve(__dirname),
        historyApiFallback: true,
        // proxy: {
        //     '!/*.{css,js,hot-update.json}': {
        //         target: devUrl,
        //         secure: false,
        //         // changeOrigin: true
        //     }
        // },
        // compress: true,
        port: NODE.PORT,
        progress: true,
        hot: true,
        inline: true,
        stats: {
            assets: true,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: true,
            chunkModules: false,
            // https: true,
        }
    }
};
