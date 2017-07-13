module.exports = (req, res, next) => {
    console.log('using auth middlewares')
    next()
}

