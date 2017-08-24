module.exports = (app) => {
    const config = app.locals.config

    if (config.onlySecure) {
        app.use((req, res, next) => {
            if (req.secure) {
                return next()
            }

            let address = 'https://' + config.domain
            if (config.httpsPort !== 443) {
                address += ':' + config.httpsPort
            }

            address += req.url

            return res.redirect(address)
        })
    }
}
