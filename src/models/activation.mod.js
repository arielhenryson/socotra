/// <reference path="../core/_all.d.ts" />
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
var model_mod_1 = require('../models/model.mod');
var Activation = (function (_super) {
    __extends(Activation, _super);
    function Activation() {
        _super.call(this);
    }
    Activation.prototype.getAccountData = function (activationKey) {
        var _this = this;
        var where = {
            activationKey: activationKey
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
                resolve(true);
            });
        });
    };
    Activation.prototype.verfidUser = function (activationKey) {
        var _this = this;
        var where = {
            activationKey: activationKey
        };
        var what = {
            $set: {
                verified: true
            }
        };
        return new Promise(function (resolve, reject) {
            _this.db.collection("users").update(where, what, function (err, doc) {
                if (err) {
                    reject(err);
                    return;
                }
                if (doc === null) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    };
    Activation.prototype.activateAccount = function (activationKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var userData = yield this.getAccountData(activationKey);
            if (!userData) {
                return {
                    error: 1,
                    msg: "code not match any user"
                };
            }
            var verifiedUser = yield this.verfidUser(activationKey);
            if (!verifiedUser) {
                return {
                    error: 1,
                    msg: "Can't write to db"
                };
            }
            return {
                error: 0,
                msg: "email account verified successfully"
            };
        });
    };
    return Activation;
}(model_mod_1.Model));
exports.Activation = Activation;
//# sourceMappingURL=activation.mod.js.map