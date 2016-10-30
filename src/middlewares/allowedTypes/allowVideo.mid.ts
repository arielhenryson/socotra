module.exports = (req, res, next) => {
    const types: string[] = [ "video/mp4", "video/avi"];

    if (typeof req.uploadAllowedTypes === "undefined") {
        req.uploadAllowedTypes = [];
    }

    req.uploadAllowedTypes = req.uploadAllowedTypes.concat(types);

    next();
};