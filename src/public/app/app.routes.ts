import { Component } from '@angular/core'
import { Routes } from '@angular/router'



@Component({
    template: `
    page1
  `
})
export class Home {}

@Component({
    template: `
    page2
  `
})
export class Page2 {}

@Component({
    template: `
    page3
  `
})
export class Page3 {}

export const _routes: Routes = [
    { path: 'home', component: Home },
    { path: 'page2', component: Page2 },
    { path: 'page3', component: Page3 }
]
