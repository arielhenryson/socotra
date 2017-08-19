import { Server } from './core/main'
const config = require('./config/config.json')


function extend(app) {}


const server = new Server({
    extend,
    config
})
server.run()
