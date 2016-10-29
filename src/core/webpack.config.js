const ROOT = "../../";


const webpack = require('webpack');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');



module.exports = {
    plugins: [
        new DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        })
    ],
    entry: {
        app: ROOT + "./.build/public/app/main",
        vendor: ROOT + "./.build/public/app/vendor"
    },
    output: {
        path: __dirname,
        filename: ROOT +"./.build/public/dist/[name].js"
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [{
            test: /\.ts/, loaders: ['ts-loader'], exclude: /node_modules/
        }]
    }
};