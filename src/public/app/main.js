"use strict";
// the polyfills must be the first thing imported
require('angular2-universal-polyfills');
// Angular 2
var core_1 = require('@angular/core');
var angular2_universal_1 = require('angular2-universal');
core_1.enableProdMode();
var mainModule_1 = require('./mainModule');
var platformRef = angular2_universal_1.platformUniversalDynamic();
// on document ready bootstrap Angular 2
document.addEventListener('DOMContentLoaded', function () {
    platformRef.bootstrapModule(mainModule_1.MainModule);
});
//# sourceMappingURL=main.js.map