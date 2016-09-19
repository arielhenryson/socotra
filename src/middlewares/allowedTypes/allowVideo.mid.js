/// <reference path="../../core/_all.d.ts" />
module.exports = function (req, res, next) {
    var types = ["video/mp4", "video/avi"];
    if (typeof req.uploadAllowedTypes === "undefined") {
        req.uploadAllowedTypes = [];
    }
    req.uploadAllowedTypes = req.uploadAllowedTypes.concat(types);
    next();
};
//# sourceMappingURL=allowVideo.mid.js.map