/// <reference path="../_all.d.ts" />
"use strict";

import * as crypto from 'crypto';
const config = require('../../config/config.json');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
let url = `${config.dbHost}:${config.dbPort}/${config.dbName}`;
if (typeof config.dbUserPassword !== undefined &&
    config.dbUserPassword.length) {
    // Authenticate a database
    url = `${config.dbUserName$}:${config.dbUserPassword}@${config.dbHost}:${config.dbPort} /${config.dbName}`;

}

let mongo = null;

MongoClient.connect("mongodb://" + url, function(error, db) {
    console.log("database connection established");
    mongo = db;
});

export class DB {
    public db;

    constructor() {
        this.connect();
    }

    public connect(): void {
        if (mongo !== null) {
            this.db = mongo;
            return;
        }

        let watcher = setInterval(() => {
            if (mongo !== null) {
                this.db = mongo;


                (function (clearInterval){
                    clearInterval(watcher);
                }(clearInterval));
            }
        }, 1000);
    }

    public promiseConnection(): Promise<any> {
        return new Promise((resolve) => {
            let watcher = setInterval(() => {
                if (this.db !== null) {
                    const what = {
                        UTC: new Date()
                    };

                    this.db.collection("_startLog").insert(what, function (err, doc) {
                        if (err) {
                            resolve(false);
                            return;
                        }

                        resolve(true);
                    });

                    (function (clearInterval){
                        clearInterval(watcher);
                    }(clearInterval));
                }
            }, 1000);
        });
    }

    public isValidId(id) {
        let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

        return checkForHexRegExp.exec(id);
    };

    public createNewId(value) {
        if (this.isValidId(value)) {
            return new ObjectID(value);
        }

        return new ObjectID();
    }

    public makeDoc(data: Object): Object {
        let object = {
            createTime: new Date()
        };

        for (let key in data) {
            object[key] = data[key];
        }

        return object;
    }

    public makeNewSolt(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    public hash(value: string, solt: string): string {
        return crypto.createHmac("sha256", solt).update(value).digest('hex');
    }
}