const path = require("path");

// set root folder
const ROOT = __dirname + "/../../../.build/";
// end set root folder

const config = require( path.normalize(ROOT + 'config/config.json') );

const fs = require("fs");
if (config.development) {
    fs.watch( path.normalize(ROOT + 'public/dist/app.js') , () => {
        process.exit(3);
    });
}


import * as express from 'express';
const app: any = express();

// the polyfills must be the first thing imported in node.js
import 'angular2-universal-polyfills';

import './__workaround.node'; // temporary until 2.1.1 things are patched in Core




// Angular 2
import { enableProdMode } from '@angular/core';

// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';


import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';


const _routes = require(ROOT + "/public/app/app.routes")._routes;
const ServerAppModule = require(ROOT + "/public/app/server-app.module").ServerAppModule;


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
        ngModule: ServerAppModule,
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