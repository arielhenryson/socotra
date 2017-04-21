import { NgModule } from '@angular/core';
import { App } from './app.component';
import { MainModule } from "./main.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserTransferStateModule } from "./modules/transfer-state/browser-transfer-state.module";

@NgModule({
    bootstrap: [ App ],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        BrowserTransferStateModule,
        MainModule
    ],
})
export class BrowserAppModule {}