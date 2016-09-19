/// <reference path="_all.d.ts" />

"use strict";

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {DB} from '../core/lib/db';

const config = require('../config/config.json');
const ROOT: string = path.join(__dirname, '../');
const app: express.Application = express();
const fs = require('fs');
const compression = require('compression');
app.use(compression());


app.locals.ROOT = ROOT;
app.locals.config = config;

// create .temp folder for store temp files
try {
    fs.statSync('.temp/uploads');
} catch (e) {
    fs.mkdirSync('.temp/uploads');
}


let db = new DB();
db.promiseConnection().then(() => {
    // Set up cookie-parser
    app.use(require('cookie-parser')());


    // Setting the body parser for handling post requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    // set up session
    require('./session')(app);


    // Log all the request to the database
    if (config.logRequest) {
        const requestLogger = require('./middlewares/requestLogger.mid');
        app.use(requestLogger);
    }


    // angular2-universal
    require('./angular2-universal')(app);


    // Set view engine
    require('./viewEngine')(app);


    // Setting the static folder fo the app
    app.use("/", express.static(path.join(ROOT, '/public')));
    app.use("/node_modules", express.static(path.join(ROOT, '/../node_modules')));


    // Server extend layer for adding global middlewares
    // that are specific for your app
    try {
        require('../serverExtend')(app);
    } catch (e) {
        console.log("No server extend layer found");
    }


    // Routing
    require('./routes')(app);


    // Reducing the http header size
    // by removing x-powered-by
    app.disable('x-powered-by');


    // Set the http server
    if (config.httpServer) {
        require('./http')(app);
    }


    // Set the https server
    if (config.httpsServer) {
        require('./https')(app);
    }
});