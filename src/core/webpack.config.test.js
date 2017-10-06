const config = require('../config/config.json');
const path = require('path');
const ROOT = '../../';
const webpack = require('webpack');
const { AotPlugin } = require('@ngtools/webpack');


const _root = path.resolve(__dirname, ROOT);

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

let tsLoader = {
    test: /\.ts/,
    loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
    exclude: /node_modules/
};



const webpackObj = {
    devtool: 'inline-source-map',
    resolve: {
        extensions: [ '.ts', '.js']
    },
    module: {
        loaders: [
            tsLoader,
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            },
        ]
    },
};


if (process.env.coverage === 'TRUE') {
    webpackObj.module.rules.push({
        test: /\.ts/,
        use: {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true }
        },
        enforce: 'post',
        exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
    })
}

module.exports = webpackObj;
