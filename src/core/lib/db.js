/// <reference path="../_all.d.ts" />
"use strict";
var crypto = require('crypto');
var config = require('../../config/config.json');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
var url = config.dbHost + ":" + config.dbPort + "/" + config.dbName;
if (typeof config.dbUserPassword !== undefined &&
    config.dbUserPassword.length) {
    // Authenticate a database
    url = config.dbUserName$ + ":" + config.dbUserPassword + "@" + config.dbHost + ":" + config.dbPort + " /" + config.dbName;
}
var mongo = null;
MongoClient.connect("mongodb://" + url, function (error, db) {
    console.log("database connection established");
    mongo = db;
});
var DB = (function () {
    function DB() {
        this.connect();
    }
    DB.prototype.connect = function () {
        var _this = this;
        if (mongo !== null) {
            this.db = mongo;
            return;
        }
        var watcher = setInterval(function () {
            if (mongo !== null) {
                _this.db = mongo;
                (function (clearInterval) {
                    clearInterval(watcher);
                }(clearInterval));
            }
        }, 1000);
    };
    DB.prototype.promiseConnection = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var watcher = setInterval(function () {
                if (_this.db !== null) {
                    var what = {
                        UTC: new Date()
                    };
                    _this.db.collection("_startLog").insert(what, function (err, doc) {
                        if (err) {
                            resolve(false);
                            return;
                        }
                        resolve(true);
                    });
                    (function (clearInterval) {
                        clearInterval(watcher);
                    }(clearInterval));
                }
            }, 1000);
        });
    };
    DB.prototype.isValidId = function (id) {
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        return checkForHexRegExp.exec(id);
    };
    ;
    DB.prototype.createNewId = function (value) {
        if (this.isValidId(value)) {
            return new ObjectID(value);
        }
        return new ObjectID();
    };
    DB.prototype.makeDoc = function (data) {
        var object = {
            createTime: new Date()
        };
        for (var key in data) {
            object[key] = data[key];
        }
        return object;
    };
    DB.prototype.makeNewSolt = function () {
        return crypto.randomBytes(16).toString('hex');
    };
    DB.prototype.hash = function (value, solt) {
        return crypto.createHmac("sha256", solt).update(value).digest('hex');
    };
    return DB;
}());
exports.DB = DB;
//# sourceMappingURL=db.js.map