/*
let __compiler__ = require('@angular/compiler');
import { __platform_browser_private__ } from '@angular/platform-browser';
import { __core_private__ } from '@angular/core';
let patch = false;
if (!__core_private__['ViewUtils']) {
    patch = true;
    __core_private__['ViewUtils'] = __core_private__['view_utils'];
}



if (__compiler__ && __compiler__.SelectorMatcher && __compiler__.CssSelector) {
    patch = true;
    (__compiler__).__compiler_private__ = {
        SelectorMatcher: __compiler__.SelectorMatcher,
        CssSelector: __compiler__.CssSelector
    };
}

if (patch) {
    let __universal__ = require('angular2-platform-node/__private_imports__');
    __universal__.ViewUtils = __core_private__['view_utils'];
    __universal__.CssSelector = __universal__.CssSelector || __compiler__.CssSelector;
    __universal__.SelectorMatcher = __universal__.SelectorMatcher || __compiler__.SelectorMatcher;
}


function universalMaterialSupports(eventName: string): boolean { return Boolean(this.isCustomEvent(eventName)); }
__platform_browser_private__.HammerGesturesPlugin.prototype.supports = universalMaterialSupports;



import { NodeDomRootRenderer, NodeDomRenderer } from 'angular2-universal/node';
function renderComponentFix(componentProto: any) {
    return new NodeDomRenderer(this, componentProto, this._animationDriver);
}
NodeDomRootRenderer.prototype.renderComponent = renderComponentFix;
*/
