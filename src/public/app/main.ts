"use strict";

// the polyfills must be the first thing imported ///
import 'angular2-universal-polyfills';


// Angular 2
import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal';

enableProdMode();

import { MainModule } from './main.module';

const platformRef = platformUniversalDynamic();


// on document ready bootstrap Angular 2
document.addEventListener('DOMContentLoaded', () => {
    platformRef.bootstrapModule(MainModule);
});