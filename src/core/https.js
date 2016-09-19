/// <reference path="../core/_all.d.ts" />
"use strict";
var https = require("https");
var fs = require("fs");
module.exports = function (app) {
    var config = app.locals.config;
    var ROOT = app.locals.ROOT;
    var sslConfig = {
        key: fs.readFileSync(ROOT + 'config/ssl/file.pem'),
        cert: fs.readFileSync(ROOT + 'config/ssl/file.crt')
    };
    var httpsServer = https.createServer(sslConfig, app);
    httpsServer.listen(config.httpsPort, function () {
        console.log(config.appName + " https server listening on port " + config.httpsPort);
    });
};
//# sourceMappingURL=https.js.map