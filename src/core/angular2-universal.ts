/// <reference path="../core/_all.d.ts" />

import {config} from "./global";

// the polyfills must be the first thing imported in node.js
import 'angular2-universal-polyfills';

// Angular 2
import { enableProdMode } from '@angular/core';

// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';


import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';


const _routes = require(config.root + "/public/app/app.routes")._routes;
const MainModule = require(config.root + "/public/app/mainModule").MainModule;


module.exports = (app) => {
    const ROOT = app.locals.ROOT;
    const config = app.locals.config;

    enableProdMode();


    // Express View
    app.engine('.html', createEngine({}));
    app.set('views', ROOT + "/public/");
    app.set('view engine', 'html');



    app.use(cookieParser('Angular 2 Universal'));
    app.use(bodyParser.json());

    function ngApp(req, res) {
        res.render('main', {
            req,
            res,
            ngModule: MainModule,
            preboot: false,
            baseUrl: '/',
            requestUrl: req.originalUrl,
            originUrl: 'http://localhost:' + config.httpPort
        });
    }

    _routes.forEach(function (route) {
        app.get("/" + route.path, ngApp);
    });
};