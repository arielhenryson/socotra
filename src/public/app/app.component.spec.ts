import { TestBed } from '@angular/core/testing'

import { App } from './app.component'
import { BrowserDynamicTestingModule,
    platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'
import { RouterTestingModule } from '@angular/router/testing'

let fixture
let comp

describe('1st tests', () => {
    beforeEach(() => {
        TestBed.initTestEnvironment(
            BrowserDynamicTestingModule,
            platformBrowserDynamicTesting()
        )

        // refine the test module by declaring the test component
        TestBed.configureTestingModule({
            declarations: [ App ],
            imports: [ RouterTestingModule ]

        })

        // create component and test fixture
        fixture = TestBed.createComponent(App)

        // get test component from the fixture
        comp = fixture.componentInstance
    })


    it('test value', () => expect(comp.testValue).toBe('test'))
})
