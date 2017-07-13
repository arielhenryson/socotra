module.exports = (req, res, next) => {
    const types: string[] = [ 'image/jpeg', 'image/png' ]

    if (typeof req.uploadAllowedTypes === 'undefined') {
        req.uploadAllowedTypes = []
    }

    req.uploadAllowedTypes = req.uploadAllowedTypes.concat(types)

    next()
}
