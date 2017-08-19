import 'zone.js/dist/zone'
import 'reflect-metadata'
import 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserAppModule } from './browser-app.module'
import { enableProdMode } from '@angular/core'
import { environment } from './environment'

if (!environment.development) enableProdMode()
platformBrowserDynamic().bootstrapModule(BrowserAppModule)
