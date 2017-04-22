import { BehaviorSubject, Observable } from "rxjs";
import {Injectable} from "@angular/core";
const stringifyDate = require('json-stringify-date');

const appState = {};
const store = new BehaviorSubject<any>(appState);


@Injectable()
export class RXBox {
    private static isWasRun: boolean = false;

    constructor() {
        if (RXBox.isWasRun && typeof window !== "undefined") {
            throw "You can only create one instance of RXBox in your app";
        }

        RXBox.isWasRun = true;

        if (typeof window !== "undefined") {
            ((window: any) => {
                window.RXBox = {
                    state: this.store,
                    history: this.history
                };
            })(window);
        }
    }

    private lastChanges = null;

    private store: any = store;

    public saveToLocalStorage: boolean = false;
    public saveToSessionStorage: boolean = false;

    private static preventFunctionsInKey(obj) {
        for (let i in obj) {
            if (obj[i] !== null && typeof obj[i] === "object") {
                RXBox.preventFunctionsInKey(obj[i]);
            }

            if (typeof obj[i] === "function") {
                throw {
                    msg:"RXBox error -> can't store function inside RXBox store",
                    object: obj,
                    key: obj[i]
                };
            }
        }
    }

    private static objectKeyByString(o, s) {
        try {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, ''); // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                }
                else {
                    return;
                }
            }
            return o;
        }
        catch (e) {
            return;
        }
    }

    private static equals(x, y) {
        if (x === y)
            return true;
        // if both x and y are null or undefined and exactly the same
        if (!(x instanceof Object) || !(y instanceof Object))
            return false;
        // if they are not strictly equal, they both need to be Objects
        if (x.constructor !== y.constructor)
            return false;
        // they must have the exact same prototype chain, the closest we can do is
        // test there constructor.

        let p;
        for (p in x) {
            if (!x.hasOwnProperty(p))
                continue;
            // other properties were tested using x.constructor === y.constructor
            if (!y.hasOwnProperty(p))
                return false;
            // allows to compare x[ p ] and y[ p ] when set to undefined
            if (x[p] === y[p])
                continue;
            // if they have the same strict value or identity then they are equal
            if (typeof (x[p]) !== "object")
                return false;
            // Numbers, Strings, Functions, Booleans must be strictly equal
            if (!RXBox.equals(x[p], y[p]))
                return false;
        }
        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
                return false;
        }
        return true;
    }

    private static clone(obj: any) {
        if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

        let temp;
        if (obj instanceof Date) {
            temp = obj.constructor(); // or new Date(obj);
        } else {
            temp = obj.constructor();
        }

        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = RXBox.clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }

        return temp;
    }


    // old the history of the app state
    // only work when debug is set to true
    private history = [];


    // Observable that watch for any change in the store
    private changes = store.asObservable().distinctUntilChanged();


    // push old state to history
    private pushHistory() {
        // prevent save more then one version in the history when not
        // running in debug mode
        if (!this.debug && this.history.length) {
            this.history.shift();
        }

        const state = this.getState();
        this.history.push(state);
    }


    // ************************** API **************************

    // change this for true when you want to push to history
    debug = false;

    // save to sessionStorage
    sessionStorage = false;

    // save to localStorage
    localStorage = false;


    // show the history of the state
    getHistory() {
        return this.history;
    }


    // remove all state history
    clearHistory() {
        this.history = [];
    }


    // watch for key change in store (you can also use nested key
    // like "key1.key2.key3")
    watch(key?: any) {
        return Observable.create(observer => {
            if (typeof window === "undefined") {
                throw "RXBox can't run watch in server code";
            }

            this.changes.subscribe(state => {
                // watch for all change (no key specified)
                if (typeof key === "undefined") {
                    observer.next(state);
                    return;
                }


                // if we inside this catch meaning that the key to watch
                // is not inside the last change so we can return
                // without response to the subscribers
                const isKeyInLastChange = RXBox.objectKeyByString(this.lastChanges, key);
                if (typeof isKeyInLastChange === "undefined") {
                    return;
                }

                const newValue = RXBox.objectKeyByString(state, key);
                const oldState = this.history[this.history.length - 1];
                const oldValue = RXBox.objectKeyByString(oldState, key);
                const equals = RXBox.equals(newValue, oldValue);
                if (!equals) {
                    observer.next(RXBox.objectKeyByString(state, key));
                }
            });
        });
    }


    // return current state
    getState() {
        return RXBox.clone(this.store.value);
    }


    // remove current state
    clearState() {
        this.store.next({});
    }


    // merge new keys to the current state
    assignState(stateChanges: Object) {
        if (typeof window === "undefined") {
            throw "RXBox can't run assignState in server code";
        }

        if (this.debug) {
            RXBox.preventFunctionsInKey(stateChanges);
        }

        const newState = Object.assign({}, this.getState(), stateChanges);

        this.pushHistory();
        this.lastChanges = stateChanges;

        this.store.next(newState);

        if (this.saveToLocalStorage) {
            localStorage.setItem("__rxbox", stringifyDate.stringify(this.getState()));
        }

        if (this.saveToSessionStorage) {
            sessionStorage.setItem("__rxbox", stringifyDate.stringify(this.getState()));
        }
    }

    getStoreFromSessionStorage() {
        return stringifyDate.parse(sessionStorage.getItem("__rxbox"));
    }

    getStoreFromLocalStorage() {
        return stringifyDate.parse(localStorage.getItem("__rxbox"));
    }
}



declare let Object:any;
interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            let to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                let nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                let keysArray = Object.keys(Object(nextSource));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    let nextKey = keysArray[nextIndex];
                    let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}