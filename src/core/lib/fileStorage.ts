/// <reference path="../_all.d.ts" />

"use strict";

import * as fs from 'fs';
import {DB} from '../lib/db';

const config = require('../../config/config.json');
const GridFSBucket = require('mongodb').GridFSBucket;
const GridStore = require('mongodb').GridStore;



export class FileStorage extends DB {
    constructor() {
        super();
    }
    
    public writeFile(data): Promise<any> {
        const bucket = new GridFSBucket(this.db);
        
        return new Promise((resolve) => {
            let id = this.createNewId("");
            let options = {
                metadata: data.metadata
            };
            
            fs.createReadStream(data.path).
            pipe(bucket.openUploadStreamWithId(id, data.name, options)).
            on('error', function(error) {
                resolve({
                    error: 1
                });
            }).
            on('finish', function() {
                resolve({
                    error: 0, 
                    id: id.toString()
                });
            });
        });
    }
    
    public async readFile(id) {
        id = this.createNewId(id);
        
        // first we try to get the file metadata
        const fileInfo: any = await this.getFileInfo(id);
        console.log(fileInfo);

        if (fileInfo === null) {
            return ({
                error: 1,
                msg: "file not found"
            });
        }
        
        // If we rich here we now that the file was found
        // so we can stream the file back
        const fileStream: any = await this.streamFile(id, fileInfo.metadata.mimetype);

        return fileStream;
    }
    
    public deleteFile(id): Promise<any> {
        id = this.createNewId(id);
        const bucket = new GridFSBucket(this.db);

        return new Promise((resolve) => {
            bucket.delete(id, function(error) {
                if (error) {
                    resolve({
                        error: 1,
                        msg: error
                    });
                }

                resolve({
                    error: 0,
                    msg: "File was deleted successfully"
                });
            });
        });
    }
    
    public isFileExists(id): Promise<boolean> {
        return new Promise((resolve) => {
            this.db.collection("fs.files").findOne({
                _id: id
            }, (err, doc) => {
                if (doc === null) {
                    resolve(false);
                    return;
                }
                
                resolve(true);
            });
        });
    };
    
    public getFileInfo(id): Promise<any> {
        return new Promise((resolve) => {
            this.db.collection("fs.files").findOne({
                _id: id
            }, (err, doc) => {
                if (doc === null) {
                    resolve(null);
                    return;
                }

                resolve(doc);
            });
        });
    }
    
    private streamFile(id, mimetype): Promise<any> {
        return new Promise((resolve) => {
            const gs = new GridStore(this.db, id, 'r');
            gs.open((err, gs) => {
                gs.read((error, fileContent) => {
                    if (error) {
                        resolve({
                            error: 2,
                            msg: "error read file from db"
                        });
                    }

                    resolve({
                        error: 0,
                        mimetype: mimetype,
                        data: fileContent
                    });
                });
            }); // end gs.open
        });
    }
}

/*
var test = new FileStorage();
test.promiseConnection().then(function () {
	test.writeFile();
});
*/
