/// <reference path="../core/_all.d.ts" />

module.exports = (req, res, next) => {
    console.log("using auth mid");
    next();
};
