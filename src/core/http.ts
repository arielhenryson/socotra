/// <reference path="../core/_all.d.ts" />

"use strict";

import * as http from "http";

module.exports = (app) => {
    const config = app.locals.config;
    
    const httpServer = http.createServer(app);
    httpServer.listen(config.httpPort, () => {
        console.log(`${config.appName} http server listening on port ${config.httpPort}`);
    });
};