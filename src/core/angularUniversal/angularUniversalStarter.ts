import { extractRoutes } from './util/extractRoutes'
const spawn = require('child_process').spawn
import { config } from '../global'

const proxy = require('express-http-proxy')
const fs = require('fs')



module.exports = (app) => {
    let content

    try {
        content = fs.readFileSync(config.root + '/public/app/app.routes.js', 'utf8')
    } catch (e) {
        throw new Error("Can't load app.routes files")
    }

    const _routes = extractRoutes(content)

    _routes.forEach(function (route) {
        app.get('/' + route, proxy('localhost:3001/' + route))
    })


    let angularProcess

    function run() {
        angularProcess = spawn('node', [__dirname + '/angularProcess.js'], {
            stdio: 'inherit'
        })

        angularProcess.on('close', code => {
            if (config.development && code !== 3) {
                console.log('Error detected in angular process, waiting for changes...')
                return
            }

            console.log('Angular process stop restart in 3 sec..')

            setTimeout(() => {
                run()
            }, 3000)
        })
    }

    run()
}
