/// <reference path="../../core/_all.d.ts" />


import {RequestLogger} from '../models/requestLogger.mod';

(function() {
    module.exports = (req, res, next) => {
        const requestData = {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            url: req.protocol + '://' + req.get('host') + req.originalUrl,
            params: req.query
        };
        
        let logger = new RequestLogger();
        logger.log(requestData);
        
        next();
    };
} ());