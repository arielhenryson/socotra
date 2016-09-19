/// <reference path="../core/_all.d.ts" />
"use strict";
var db_1 = require('./lib/db');
// Instead of saving sessions to RAM
// we save the session to mongodb
// to enable working with multiple server
module.exports = function (app) {
    var config = app.locals.config;
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);
    var dbObj = new db_1.DB();
    var dbOptions = {
        db: dbObj.db,
        collection: '_sessions'
    };
    // Express MongoDB session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new MongoStore(dbOptions),
        saveUninitialized: true,
        resave: true // save session if unmodified
    }));
};
//# sourceMappingURL=session.js.map