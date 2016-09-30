import {Server} from "./core/main";

const config = require('./config/config.json');

function extend(app) {
   // console.log(__dirname);
}


const _server = new Server({
    root: __dirname,
    extend: extend,
    config: config
});
_server.run();