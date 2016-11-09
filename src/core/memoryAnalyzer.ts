const heapdump = require('heapdump');


module.exports = (app) => {
    const config = app.locals.config;


    if (!config.memoryAnalyzer) return;

    setInterval(() => {
        heapdump.writeSnapshot("../../log/h_" + Date.now() + ".heapsnapshot", (err, filename) => {
            console.log('dump written to', filename);
        });
    }, 1000 * 15);
};