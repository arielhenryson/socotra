/// <reference path="../../core/_all.d.ts" />
"use strict";
var config = require('../../config/config.json');
var multer = require('multer');
var fileStorage_1 = require('../lib/fileStorage');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '.temp/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var multerOptions = {
    limits: {
        fileSize: config.maxUploadSize
    },
    storage: storage
};
var upload = multer(multerOptions).array('files[]');
var gridStorage = new fileStorage_1.FileStorage();
module.exports = function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            req._upload = {
                error: 1,
                msg: err
            };
            next();
            return;
        }
        var lastIndex = req.files.length - 1;
        req._upload = {
            error: 0,
            files: []
        };
        // loop throw the uploaded files and save to GridFS
        var _loop_1 = function(i) {
            var index = Number(i);
            var file = req.files[i];
            var data = {
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
            gridStorage.writeFile(data).then(function (result) {
                if (result.error) {
                    req._upload.files.push({
                        error: 2,
                        msg: "error write to GridFS"
                    });
                }
                else {
                    // write the file id to the req so next middlewares can see it
                    data.id = result.id;
                    req._upload.files.push(data);
                }
                // remove file from temp folder
                fs.unlink(file.path, function () { });
                // If this is the last iteration we can move to the next middleware
                var watcher = setInterval(function () {
                    if (index === lastIndex && req._upload.files.length === req.files.length) {
                        (function (clearInterval) {
                            clearInterval(watcher);
                        })(clearInterval);
                        next();
                    }
                }, 100);
            }); // end gridStorage
        };
        for (var i in req.files) {
            _loop_1(i);
        } // end for loop
    }); // end upload
};
//# sourceMappingURL=_upload.mid.js.map