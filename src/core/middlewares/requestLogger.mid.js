/// <reference path="../../core/_all.d.ts" />
"use strict";
var requestLogger_mod_1 = require('../models/requestLogger.mod');
(function () {
    module.exports = function (req, res, next) {
        req.session.lastPage = '/awesome';
        var requestData = {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            url: req.protocol + '://' + req.get('host') + req.originalUrl,
            params: req.query
        };
        var logger = new requestLogger_mod_1.RequestLogger();
        logger.log(requestData);
        next();
    };
}());
//# sourceMappingURL=requestLogger.mid.js.map