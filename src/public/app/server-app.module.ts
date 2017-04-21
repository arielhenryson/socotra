import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import {App} from './app.component';
import { MainModule } from "./main.module";

@NgModule({
    bootstrap: [ App ],
    imports: [
        MainModule,
        UniversalModule
    ],
})
export class ServerAppModule {

}