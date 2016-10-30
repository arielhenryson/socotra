import * as https from "https";
import * as fs from "fs";


module.exports = (app) => {
    const config = app.locals.config;
    const ROOT = app.locals.ROOT;
    
    const sslConfig = {
        key: fs.readFileSync(ROOT + 'config/ssl/file.pem'), 
        cert: fs.readFileSync(ROOT + 'config/ssl/file.crt')
    };
    
    const httpsServer = https.createServer(sslConfig, app);
    
    httpsServer.listen(config.httpsPort, () => {
        console.log(`${config.appName} https server listening on port ${config.httpsPort}`);
    });
};