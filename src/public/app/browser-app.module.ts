import { NgModule } from '@angular/core';
import { App } from './app.component';
import { MainModule } from "./main.module";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
    bootstrap: [ App ],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        MainModule
    ],
})
export class BrowserAppModule {}