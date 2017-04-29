import * as crypto from 'crypto';
import {config} from "../global";
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


let mongo = null;

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

        // mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
        let url = `${config.dbHost}:${config.dbPort}/${config.dbName}`;
        if (typeof config.dbUserPassword !== undefined &&
            config.dbUserPassword.length) {
            // Authenticate a database
            url = `${config.dbUserName$}:${config.dbUserPassword}@${config.dbHost}:${config.dbPort} /${config.dbName}`;

        }

        MongoClient.connect("mongodb://" + url, function(error, db) {
            console.log("database connection established");
            mongo = db;
        });

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
                        UTC: new Date()z
                    };

                    this.db.collection("_startLog").insert(what, function (err) {
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

    public static isValidId(str: string) {
        str = str + '';
        var len = str.length, valid = false;
        if (len == 12 || len == 24) {
            valid = /^[0-9a-fA-F]+$/.test(str);
        }
        return valid;
    };

    public static createNewId(value?: string) {
        if (DB.isValidId(value)) {
            return new ObjectID(value);
        }

        return new ObjectID();
    }

    public static makeDoc(data: MongoDoc): Object {
        if (typeof data._createTime !== "undefined") {
            return data;
        }

        let object = {
            _createTime: new Date()
        };

        for (let key in data) {
            object[key] = data[key];
        }

        return object;
    }

    public static makeNewSolt(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    public static hash(value: string, solt: string): string {
        return crypto.createHmac("sha256", solt).update(value).digest('hex');
    }

    public dbFindOne(collection: string, where: any, options: any) {
        return new Promise((resolve) => {
            this.db.collection(collection).findOne(where, options, (error, data) => {
                resolve({
                    error: error,
                    data: data
                });
            });
        });
    }

    public dbInsert(collection: string, docs, options: any) {
        return new Promise((resolve) => {
            if (docs instanceof Array) {
                for (let i in docs) {
                    docs[i] = DB.makeDoc(docs[i]);
                }
            } else {
                docs = DB.makeDoc(docs);
            }

            this.db.collection(collection).insert(docs, (error) => {
                resolve({
                    error: error
                });
            });
        });
    }

    public dbUpdate(collection: string, where: any, what: any, options: any) {
        return new Promise((resolve) => {
            this.db.collection(collection).update(where, what, options, (error, results) => {
                resolve({
                    error: error,
                    results: results
                });
            });
        });
    }

    public dbFind(collection: string, where: any, options: any) {
        return new Promise((resolve) => {
            this.db.collection(collection).find(where, options).toArray( (error, data) => {
                resolve({
                    error: error,
                    data: data
                });
            });
        });
    }
}