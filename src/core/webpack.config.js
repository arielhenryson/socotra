const config = require('../config/config.json');
const path = require("path");
const ROOT = "../../";
const webpack = require('webpack');
const {AotPlugin} = require('@ngtools/webpack');

let useAOT = false;

if (!config.development) {
        useAOT = true;
}


let tsLoader = {
        test: /\.ts/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: /node_modules/
};

let plugins = [];
if (useAOT) {
        const aot = new AotPlugin({
                tsConfigPath: path.normalize(ROOT + "./tsconfig.json")
                //entryModule:  "../../src/public/app/browser-app.module#BrowserAppModule"
        });
        plugins.push(aot);
        tsLoader = {
                test: /\.ts$/,
                loader: '@ngtools/webpack',
        };
}


module.exports = {
        entry: {
        app: path.normalize(ROOT + "./src/public/app/main.browser")
        },
        output: {
                path: __dirname,
                filename: path.normalize(ROOT +"./.build/public/dist/[name].js")
        },
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
        plugins: plugins
};