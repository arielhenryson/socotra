import 'zone.js/dist/zone-node'
import 'reflect-metadata'
import 'rxjs/Rx'
import * as express from 'express'
import { ngExpressEngine } from './express-engine'
const fs = require('fs')
const path = require('path')


const ROOT = __dirname + '/../../../.build/'
const config = require( path.normalize(ROOT + 'config/config.json') )

if (config.development) {
    fs.watch( path.normalize(ROOT + 'public/dist/app.js') , () => {
        process.exit(3)
    })
}


const app: any = express()


// Angular 2
import { enableProdMode } from '@angular/core'



import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'


const _routes = require(ROOT + '/public/app/app.routes')._routes
const ServerAppModule = require(ROOT + '/public/app/server-app.module').ServerAppModule


enableProdMode()


// Express View
app.engine('.html', ngExpressEngine({
    bootstrap: ServerAppModule
}))
app.set('views', ROOT + '/public/')
app.set('view engine', 'html')



app.use(cookieParser('Angular 2 Universal'))
app.use(bodyParser.json())

function ngApp(req, res) {
    res.render('main', {
        req,
        res,
        ngModule: ServerAppModule,
        preboot: false,
        baseUrl: '/',
        requestUrl: req.originalUrl,
        originUrl: 'http://localhost:' + config.httpPort
    })
}

_routes.forEach(function (route) {
    app.get('/' + route.path, ngApp)
})


const angularProcessPort = 3001

app.listen(angularProcessPort,  () => {
    console.log('Angular Universal Process is listening on port ' + angularProcessPort)
})
