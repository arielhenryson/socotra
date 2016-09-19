/// <reference path="../../core/_all.d.ts" />

const config = require('../../config/config.json');
const multer  = require('multer');
import {FileStorage} from  '../lib/fileStorage';
import * as fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '.temp/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

const multerOptions = {
    limits: {
        fileSize: config.maxUploadSize
    },
    storage : storage
};

const upload = multer(multerOptions).array('files[]');
const gridStorage = new FileStorage();

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            req._upload = {
                error: 1,
                msg: err
            };

            next();
            return;
        }

        const lastIndex: number = req.files.length - 1;

        req._upload = {
            error: 0,
            files: []
        };

        // loop throw the uploaded files and save to GridFS
        for (let i in req.files) {
            const index: number = Number(i);

            let file = req.files[i];
            let data = {
                id: null,
                path: file.path,
                name: file.originalname,
                metadata: {
                    size: file.size,
                    encoding: file.encoding,
                    mimetype: file.mimetype,
                    userID: req.session.user.id
                }
            };

            gridStorage.writeFile(data).then((result: any) =>  {
                if (result.error) {
                    req._upload.files.push({
                        error: 2,
                        msg: "error write to GridFS"
                    });
                } else {
                    // write the file id to the req so next middlewares can see it
                    data.id = result.id;

                    req._upload.files.push(data);
                }

                // remove file from temp folder
                fs.unlink(file.path, () => {});

                // If this is the last iteration we can move to the next middleware
                let watcher = setInterval(() => {
                    if (index === lastIndex && req._upload.files.length === req.files.length) {
                        (function(clearInterval){
                            clearInterval(watcher);
                        })(clearInterval);
                        next();
                    }
                }, 100);
            }); // end gridStorage
        } // end for loop
    });  // end upload
};