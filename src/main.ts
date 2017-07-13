import {Server} from './core/main'
const config = require('./config/config.json')
const environment = require('./config/environment.json')
config.development = environment.development

function extend() {
    // console.log(__dirname);
}


const server = new Server({
    extend,
    config
})
server.run()
