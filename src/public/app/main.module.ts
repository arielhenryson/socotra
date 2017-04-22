import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { App } from './app.component';
import { Home, Page2, Page3, _routes } from "./app.routes";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { TransferHttpModule } from "./modules/transfer-http/transfer-http.module";
import { RXBox } from "rxbox";

@NgModule({
    bootstrap: [ App ],
    declarations: [
        App,
        Home,
        Page2,
        Page3
    ],
    imports: [
        CommonModule,
        HttpModule,
        TransferHttpModule,
        RouterModule.forRoot(_routes)
    ],
    exports: [
        App
    ],
    providers: [
        { provide: RXBox, useClass: RXBox },
    ]
})
export class MainModule {}