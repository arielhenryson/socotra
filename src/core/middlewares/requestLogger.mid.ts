import { RequestLogger } from '../models/requestLogger.mod'


module.exports = (req, res, next) => {
    const requestData = {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        params: req.query
    }

    const logger = new RequestLogger()
    logger.log(requestData)

    next()
}
