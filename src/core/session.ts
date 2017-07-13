import { DB } from  './lib/db'
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)


// Instead of saving sessions to RAM
// we save the session to mongodb
// to enable working with multiple server
module.exports = (app) => {
    const config = app.locals.config
    const dbObj = new DB()

    const dbOptions = {
        db: dbObj.db,
        collection: '_sessions'
    }
    
    // Express MongoDB session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new MongoStore(dbOptions),
        saveUninitialized: true, // if false don't create session until something stored
        resave: true // save session if unmodified
    }))
}
