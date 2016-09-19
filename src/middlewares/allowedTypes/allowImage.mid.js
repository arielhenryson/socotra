/// <reference path="../../core/_all.d.ts" />
module.exports = function (req, res, next) {
    var types = ["image/jpeg", "image/png"];
    if (typeof req.uploadAllowedTypes === "undefined") {
        req.uploadAllowedTypes = [];
    }
    req.uploadAllowedTypes = req.uploadAllowedTypes.concat(types);
    next();
};
//# sourceMappingURL=allowImage.mid.js.map