const helmet = require('helmet');
const stripTag = require("./middlewares/stripTags.mid");
const RateLimit = require('express-rate-limit');

module.exports = (app) => {
    const config = app.locals.config;


    // app.use(helmet.contentSecurityPolicy());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());

    // Reducing the http header size
    // by removing x-powered-by
    app.disable('x-powered-by');


    if (config.stripTag) {
        // protect against XSS attacks
        app.use(stripTag);
    }


    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

    var limiter = new RateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: config.numberOfRequestForIpPerMinute, // limit each IP to x requests per windowMs
        delayMs: 0 // disable delaying - full speed until the max limit is reached
    });

    //  apply to all requests
    app.use(limiter);
};