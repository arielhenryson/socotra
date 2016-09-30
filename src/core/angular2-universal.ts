/// <reference path="../core/_all.d.ts" />

// the polyfills must be the first thing imported in node.js
import 'angular2-universal-polyfills';


// Angular 2
import { enableProdMode } from '@angular/core';

// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';


import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import {_routes} from "../public/app/app.routes";
import {MainModule} from "../public/app/mainModule";


module.exports = (app) => {
    const ROOT = app.locals.ROOT;

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
            originUrl: 'http://localhost:3000'
        });
    }

    _routes.forEach(function (route) {
        app.get("/" + route.path, ngApp);
    });
};