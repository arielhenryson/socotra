import 'zone.js/dist/zone'
import 'reflect-metadata'
import 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserAppModule } from './browser-app.module'
import { enableProdMode } from '@angular/core'
const environment = require('../../config/environment.json')

if (!environment.development) enableProdMode()
platformBrowserDynamic().bootstrapModule(BrowserAppModule)
