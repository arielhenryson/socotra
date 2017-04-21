import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import {App} from './app.component';
import {Home, Page2, Page3, _routes} from "./app.routes";
import {CommonModule} from "@angular/common";

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
        RouterModule.forRoot(_routes)
    ],
    exports: [
        App
    ]
})
export class MainModule {}