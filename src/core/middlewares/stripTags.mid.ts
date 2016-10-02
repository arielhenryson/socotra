const strip = require('striptags');


function _stripTag(obj) {
    for (let key in obj) {
        if (typeof obj[key] === "object") {
            obj[key] = _stripTag(obj[key]);
        } else {
            obj[key] = strip(obj[key], ["br"]);
        }
    }

    return obj;
}

module.exports = (req, res, next) => {
    req.query = _stripTag(req.query);
    req.body = _stripTag(req.body);
    next();
};