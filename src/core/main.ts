/// <reference path="_all.d.ts" />

"use strict";

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {DB} from './lib/db';
import {setConfig} from "./global";



// set root folder
let pathArray: any = process.argv[1];
pathArray = pathArray.split('/');
pathArray.pop();
let ROOT = "/";
for (let i in pathArray) {
    ROOT += pathArray[i] + '/';
}
// end set root folder



const app: any = express();
const fs = require('fs');
const compression = require('compression');
app.use(compression());




// create .temp folder for store temp files
function makeDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}


export class Server {
    private options = {
        config: null,
        extend: null
    };

    constructor(options) {
        makeDir(".temp");
        makeDir(".temp/uploads");
        this.options = options;

        this.options.config.root = ROOT;
        app.locals.ROOT = ROOT;
        app.locals.config = this.options.config;
    }

    run() {
        const ROOT = this.options.config.root;
        const config = this.options.config;

        setConfig(config);

        let db = new DB();
        db.promiseConnection().then(() => {
            require('./security')(app);

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


            // Setting the static folder fo the app
            app.use("/", express.static(path.join(ROOT, '/public')));
            app.use("/node_modules", express.static(path.join(ROOT, '/../node_modules')));


            // // Server extend layer for adding global middlewares
            // // that are specific for your app
            try {
                this.options.extend(app);
                if (this.options.extend !== null) {
                    this.options.extend(app);
                }
            } catch (e) {
                console.log("No server extend layer found");
            }

            // Routing
            require('./routes')(app);


            // Set the http server
            if (config.httpServer) {
                require('./http')(app);
            }


            // Set the https server
            if (config.httpsServer) {
                require('./https')(app);
            }
        });
    }
}