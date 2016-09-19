/// <reference path="../core/_all.d.ts" />
"use strict";
// the polyfills must be the first thing imported in node.js
require('angular2-universal-polyfills');
// Angular 2
var core_1 = require('@angular/core');
// Angular 2 Universal
var angular2_express_engine_1 = require('angular2-express-engine');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app_routes_1 = require("../public/app/app.routes");
var mainModule_1 = require("../public/app/mainModule");
module.exports = function (app) {
    core_1.enableProdMode();
    // Express View
    app.engine('.html', angular2_express_engine_1.createEngine({}));
    app.set('views', __dirname + "/../public/");
    app.set('view engine', 'html');
    app.use(cookieParser('Angular 2 Universal'));
    app.use(bodyParser.json());
    function ngApp(req, res) {
        res.render('main', {
            req: req,
            res: res,
            ngModule: mainModule_1.MainModule,
            preboot: false,
            baseUrl: '/',
            requestUrl: req.originalUrl,
            originUrl: req.hostname
        });
    }
    app_routes_1._routes.forEach(function (route) {
        app.get("/" + route.path, ngApp);
    });
};
//# sourceMappingURL=angular2-universal.js.map