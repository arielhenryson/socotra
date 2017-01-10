const ROOT = "../../";
const webpack = require('webpack');


module.exports = {
    plugins: [
        new webpack.NoErrorsPlugin(),
        // new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            },
            sourceMap: false
        })
    ],
    entry: {
        app: ROOT + "./src/public/app/main",
        vendor: ROOT + "./src/public/app/vendor"
    },
    output: {
        path: __dirname,
        filename: ROOT +"./.build/public/dist/[name].js"
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            },
        ]
    }
};