/// <reference path="../core/_all.d.ts" />
"use strict";
var http = require("http");
module.exports = function (app) {
    var config = app.locals.config;
    var httpServer = http.createServer(app);
    httpServer.listen(config.httpPort, function () {
        console.log(config.appName + " http server listening on port " + config.httpPort);
    });
};
//# sourceMappingURL=http.js.map