import { Component } from '@angular/core';
import { RXBox } from "./services/rxbos.service";

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class App {
    constructor(private _store: RXBox) {
        if (typeof window === "undefined") return;
        this._store.debug = true;

        this._store.watch('foo.bar').subscribe((val) => {
            console.log("change in foo.bar value",  val);
        });


        this._store.assignState({foo: {
            bar: {
                foo: 1
            }
        }});

        this._store.assignState({foo: {
            bar: {
                foo: 3333
            }
        }});


        let index = 0;
        setInterval(() => {
            let foo = this._store.getState()['foo'];
            foo.bar = index;
            index++;
            // foo.bar
            this._store.assignState({foo: foo});
        }, 1000 * 3);
    }

    public testValue = "test";
}