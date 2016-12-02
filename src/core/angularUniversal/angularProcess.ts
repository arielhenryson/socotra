// set root folder
const ROOT = __dirname + "/../../../.build/";
// end set root folder


import * as express from 'express';
const app: any = express();

// the polyfills must be the first thing imported in node.js
import 'angular2-universal-polyfills';

const config = require(ROOT + 'config/config.json');


// Angular 2
import { enableProdMode } from '@angular/core';

// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';


import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';


const _routes = require(ROOT + "/public/app/app.routes")._routes;
const MainModule = require(ROOT + "/public/app/mainModule").MainModule;


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


const angularProcessPort = 3001;
app.listen(angularProcessPort,  () => {
    console.log('Angular Universal Process is listening on port ' + angularProcessPort);
});