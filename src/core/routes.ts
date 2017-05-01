import { FileStorage } from  './lib/fileStorage';
import * as fs from 'fs';
import { RequestValidator } from "./lib/requestValidator";


module.exports = (app) => {
    const ROOT = app.locals.ROOT;
    const routes = require(ROOT + 'config/routes.json');
    const _routes = routes;
    const emailBrowserCtrl = require('./controllers/emailbrowser.ctrl');
    
    // email routing
    app.use('/_email/:id', emailBrowserCtrl);


    // test delete route
    app.all('/_delete/:id', (req, res) => {
        const id = req.params.id;

        const storage = new FileStorage();
        storage.deleteFile(id).then((results) => {
            res.send(results);
        });
    });

    
    // test download route
    app.get('/_download/:id', async (req, res) => {
        const id = req.params.id;
        const storage = new FileStorage();
        const results = await storage.readFile(id);

        if (results.error) {
            res.send(results);
            return;
        }

        res.writeHead('200', {'Content-Type': results.mimetype});
        res.end(results.data, 'binary');
    });


	// test upload route
    const _uploadMid = require('./middlewares/_upload.mid');
    app.post('/_upload', _uploadMid, function (req, res) {
        res.send(req._upload);
    });

    
    // routing
    // loop through the routes.json file
    // connecting the right controller
    // for each route and create it
    _routes.forEach(route => {
        if (route.path.startsWith('/_')) {
            throw "routes that start with underscore are saved four system special routes";
        }
        
        const controller = require(ROOT + '/controllers/' + route.controller + '.ctrl');
        let middlewares = [];


        // validate parameters if exists
        if (typeof route.params !== "undefined") {
            const m = requestValidator(route.params);
            middlewares.push(m);
        }

		// load middlewares if exist for this route
        if (typeof route.middlewares !== "undefined" && route.middlewares.length) {
            route.middlewares.forEach(midName => {
                const m = require(ROOT + '/middlewares/' + midName + '.mid');
                middlewares.push(m);
            });
        }


        // set the http method
        if (typeof route.method !== "undefined" && route.method === "GET") {
            app.get(route.path, middlewares, controller);
        } else if  (typeof route.method !== "undefined" && route.method === "PUT") {
            app.put(route.path, middlewares, controller);
        } else if (typeof route.method !== "undefined" && route.method === "POST") {
            app.post(route.path, middlewares, controller);
        } else if  (typeof route.method !== "undefined" && route.method === "DELETE") {
            app.delete(route.path, middlewares, controller);
        } else {
            app.all(route.path, middlewares, controller);
        }
    });

    // 404 route
    app.get('*', (req, res) => {
        fs.readFile(ROOT + '/views/404/404.html', 'utf8', (err, notFoundPage) => {
            if (err) {
                throw err;
            }

            res.status(404).send(notFoundPage);
        });
    });
};


function requestValidator(paramsSchema) {
    const _RequestValidator = new RequestValidator();

    return function(req, res, next) {
        const test = _RequestValidator.testParams(paramsSchema, req.body);
        if (test.error) {
            res.send(test);
            return;
        }

        let typeError: boolean = false;

        for (let i in req.body) {
            const value = req.body[i];
            if (!_RequestValidator.isValidType(value, paramsSchema[i].type)) {
                typeError = true;
                res.send({
                    error: 4,
                    msg: i + " is not with the correct type " + paramsSchema[i].type
                });
            }
        }

        if (!typeError) next();
    };
}