import { NgModule } from '@angular/core';
import { App } from './app.component';
import { MainModule } from "./main.module";

@NgModule({
    bootstrap: [ App ],
    imports: [
        MainModule
    ],
})
export class BrowserAppModule {

}