/// <reference path="../core/_all.d.ts" />

(function() {
    module.exports = (res, req, next) => {
        console.log("using demo mid");
        next();
    };
} ());