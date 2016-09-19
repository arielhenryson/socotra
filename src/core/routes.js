/// <reference path="../core/_all.d.ts" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var fileStorage_1 = require('./lib/fileStorage');
var fs = require('fs');
module.exports = function (app) {
    var ROOT = app.locals.ROOT;
    var routes = require(ROOT + 'config/routes.json');
    var emailBrowserCtrl = require(ROOT + '/core/controllers/emailbrowser.ctrl');
    // email routing
    app.use('/_email/:id', emailBrowserCtrl);
    // test delete route
    app.all('/_delete/:id', function (req, res) {
        var id = req.params.id;
        var storage = new fileStorage_1.FileStorage();
        storage.deleteFile(id).then(function (results) {
            res.send(results);
        });
    });
    // test download route
    app.get('/_download/:id', function (req, res) __awaiter(this, void 0, void 0, function* () {
        var id = req.params.id;
        var storage = new fileStorage_1.FileStorage();
        var results = yield storage.readFile(id);
        if (results.error) {
            res.send(results);
            return;
        }
        res.writeHead('200', { 'Content-Type': results.mimetype });
        res.end(results.data, 'binary');
    }));
    // test upload route
    var _uploadMid = require('./middlewares/_upload.mid');
    app.post('/_upload', _uploadMid, function (req, res) {
        res.send(req._upload);
    });
    // routing
    // loop through the routes.json file
    // connecting the right controller
    // for each route and create it
    routes.forEach(function (route) {
        if (route.path.startsWith('/_')) {
            throw "routes that start with underscore are saved four system special routes";
        }
        var controller = require(ROOT + '/controllers/' + route.controller + '.ctrl');
        var middlewares = [];
        // load middlewares if exist for this route
        if (typeof route.middlewares !== "undefined" && route.middlewares.length) {
            route.middlewares.forEach(function (midName) {
                var m = require(ROOT + '/middlewares/' + midName + '.mid');
                middlewares.push(m);
            });
        }
        if (typeof route.method !== "undefined" && route.method === "GET") {
            app.get(route.path, middlewares, controller);
        }
        else if (typeof route.method !== "undefined" && route.method === "POST") {
            app.post(route.path, middlewares, controller);
        }
        else {
            app.all(route.path, middlewares, controller);
        }
    });
    // 404 route
    app.get('*', function (req, res) {
        fs.readFile(ROOT + '/views/404/404.html', 'utf8', function (err, notFoundPage) {
            if (err) {
                throw err;
            }
            res.status(404).send(notFoundPage);
        });
    });
};
//# sourceMappingURL=routes.js.map