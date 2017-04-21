import { NgModule } from '@angular/core';
import { App } from './app.component';
import { MainModule } from "./main.module";
import { BrowserModule } from "@angular/platform-browser";
import { ServerModule } from "@angular/platform-server";

@NgModule({
    bootstrap: [ App ],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        ServerModule,
        MainModule
    ],
})
export class ServerAppModule {}