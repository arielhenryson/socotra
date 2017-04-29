module.exports = (req, res, next) => {
    console.log("inside req validator");

    next();
};