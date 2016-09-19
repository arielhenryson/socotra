/// <reference path="../_all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var fs = require('fs');
var db_1 = require('../lib/db');
var config = require('../../config/config.json');
var GridFSBucket = require('mongodb').GridFSBucket;
var GridStore = require('mongodb').GridStore;
var FileStorage = (function (_super) {
    __extends(FileStorage, _super);
    function FileStorage() {
        _super.call(this);
    }
    FileStorage.prototype.writeFile = function (data) {
        var _this = this;
        var bucket = new GridFSBucket(this.db);
        return new Promise(function (resolve) {
            var id = _this.createNewId("");
            var options = {
                metadata: data.metadata
            };
            fs.createReadStream(data.path).
                pipe(bucket.openUploadStreamWithId(id, data.name, options)).
                on('error', function (error) {
                resolve({
                    error: 1
                });
            }).
                on('finish', function () {
                resolve({
                    error: 0,
                    id: id.toString()
                });
            });
        });
    };
    FileStorage.prototype.readFile = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            id = this.createNewId(id);
            // first we try to get the file metadata
            var fileInfo = yield this.getFileInfo(id);
            console.log(fileInfo);
            if (fileInfo === null) {
                return ({
                    error: 1,
                    msg: "file not found"
                });
            }
            // If we rich here we now that the file was found
            // so we can stream the file back
            var fileStream = yield this.streamFile(id, fileInfo.metadata.mimetype);
            return fileStream;
        });
    };
    FileStorage.prototype.deleteFile = function (id) {
        id = this.createNewId(id);
        var bucket = new GridFSBucket(this.db);
        return new Promise(function (resolve) {
            bucket.delete(id, function (error) {
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
    };
    FileStorage.prototype.isFileExists = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.collection("fs.files").findOne({
                _id: id
            }, function (err, doc) {
                if (doc === null) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    };
    ;
    FileStorage.prototype.getFileInfo = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.collection("fs.files").findOne({
                _id: id
            }, function (err, doc) {
                if (doc === null) {
                    resolve(null);
                    return;
                }
                resolve(doc);
            });
        });
    };
    FileStorage.prototype.streamFile = function (id, mimetype) {
        var _this = this;
        return new Promise(function (resolve) {
            var gs = new GridStore(_this.db, id, 'r');
            gs.open(function (err, gs) {
                gs.read(function (error, fileContent) {
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
    };
    return FileStorage;
}(db_1.DB));
exports.FileStorage = FileStorage;
/*
var test = new FileStorage();
test.promiseConnection().then(function () {
    test.writeFile();
});
*/
//# sourceMappingURL=fileStorage.js.map