/// <reference path="../core/_all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var db_1 = require('../core/lib/db');
var config = require('../config/config.json');
var DBHelper = (function (_super) {
    __extends(DBHelper, _super);
    function DBHelper() {
        _super.call(this);
    }
    DBHelper.prototype.getUserIdByEmail = function (email) {
        var _this = this;
        var where = {
            email: email
        };
        return new Promise(function (resolve, reject) {
            _this.db.collection("users").findOne(where, function (err, doc) {
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
    };
    DBHelper.prototype.getUserEmailById = function (id) {
        var _this = this;
        var where = {
            _id: this.createNewId(id)
        };
        return new Promise(function (resolve, reject) {
            _this.db.collection("users").findOne(where, function (err, doc) {
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
    };
    DBHelper.prototype.isUserEmailExists = function (email) {
        var _this = this;
        var where = {
            email: email
        };
        return new Promise(function (resolve, reject) {
            _this.db.collection("users").findOne(where, function (err, doc) {
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
    };
    return DBHelper;
}(db_1.DB));
exports.DBHelper = DBHelper;
//# sourceMappingURL=dbHelper.service.js.map