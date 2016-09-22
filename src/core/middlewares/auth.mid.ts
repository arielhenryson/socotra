/// <reference path="../../core/_all.d.ts" />


(function() {
    module.exports = (req, res, next) => {
        console.log("using auth middlewares");
        next();
    };
} ());