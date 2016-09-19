/// <reference path="../../core/_all.d.ts" />
(function () {
    module.exports = function (req, res, next) {
        console.log("using auth middlewares");
        next();
    };
}());
//# sourceMappingURL=auth.mid.js.map