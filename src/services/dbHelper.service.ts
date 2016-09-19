/// <reference path="../core/_all.d.ts" />

import {DB}  from '../core/lib/db';
const config = require('../config/config.json');

export class DBHelper extends DB {
    constructor() {
        super();
    }
    
    public getUserIdByEmail(email: string) {
        const where = {
            email: email
        };
        
        return new Promise((resolve, reject) => {
            this.db.collection("users").findOne(where, (err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (doc === null) {
                    resolve(false);
                    return;
                }
                
                resolve(doc._id.toString());
            });
        });
    }
    
    public getUserEmailById(id: string) {
        const where = {
            _id: this.createNewId(id)
        };
        
        return new Promise((resolve, reject) => {
            this.db.collection("users").findOne(where, (err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (doc === null) {
                    resolve(false);
                    return;
                }
                
                resolve(doc.email);
            });
        });
    }
    
    private isUserEmailExists(email: string) {
        const where = {
            email: email
        };
        
        return new Promise((resolve, reject) => {
            this.db.collection("users").findOne(where, (err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (doc !== null) {
                    resolve(true);
                    return;
                }
                
                resolve(false);
            });
        });
    }
}