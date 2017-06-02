import * as fs from 'fs';
import { DB } from '../lib/db';


const GridFSBucket = require('mongodb').GridFSBucket;
const GridStore = require('mongodb').GridStore;



export class FileStorage extends DB {
    constructor() {
        super();
    }
    
    public writeFile(data): Promise<any> {
        const bucket = new GridFSBucket(this.db);
        
        return new Promise(resolve => {
            let id = DB.createNewId("");
            let options = {
                metadata: data.metadata
            };
            
            fs.createReadStream(data.path).
            pipe(bucket.openUploadStreamWithId(id, data.name, options)).
            on('error', function() {
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
    
    public async readFile(id, allowPrivateFile) {
        id = DB.createNewId(id);
        
        // first we try to get the file metadata
        const fileInfo: any = await this.getFileInfo(id, allowPrivateFile);

        if (fileInfo === null) {
            return ({
                error: 1,
                msg: "file not found"
            });
        }


        if (fileInfo === -1) {
            return ({
                error: 2,
                msg: "access denied"
            });
        }

        
        // If we rich here we now that the file was found
        // so we can stream the file back
        return await this.streamFile(id, fileInfo.metadata.mimetype);
    }
    
    public deleteFile(id): Promise<any> {
        id = DB.createNewId(id);
        const bucket = new GridFSBucket(this.db);

        return new Promise(resolve => {
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
        return new Promise(resolve => {
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
    
    public getFileInfo(id, allowPrivateFile): Promise<any> {
        return new Promise(resolve => {
            this.db.collection("fs.files").findOne({
                _id: id
            }, (err, doc) => {
                if (doc === null) {
                    resolve(null);
                    return;
                }


                if (doc.metadata.privateFile && !allowPrivateFile) {
                    resolve(-1);
                    return;
                }

                resolve(doc);
            });
        });
    }
    
    private streamFile(id, mimetype): Promise<any> {
        return new Promise(resolve => {
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
