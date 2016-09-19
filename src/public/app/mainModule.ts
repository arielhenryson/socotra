import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniversalModule } from 'angular2-universal';
import {RouterModule} from "@angular/router";

import {App} from './app.component';
import {Home, Page2, Page3, _routes} from "./app.routes";

@NgModule({
    bootstrap: [ App ],
    declarations: [
        App,
        Home,
        Page2,
        Page3
    ],
    imports: [
        UniversalModule,
        FormsModule,
        RouterModule.forRoot(_routes)
    ],
})
export class MainModule {

}