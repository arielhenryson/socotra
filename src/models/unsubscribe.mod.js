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
var model_mod_1 = require('./model.mod');
var Unsubscribe = (function (_super) {
    __extends(Unsubscribe, _super);
    function Unsubscribe() {
        _super.call(this);
    }
    Unsubscribe.prototype.addToUnsubscribe = function (email) {
        var _this = this;
        var obj = this.makeDoc({
            email: email
        });
        return new Promise(function (resolve) {
            _this.db.collection("unsubscribe").insert(obj, function (err, doc) {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    };
    Unsubscribe.prototype.blockUser = function (userID) {
        return __awaiter(this, void 0, void 0, function* () {
            var userEmail = yield this.DBHelper.getUserEmailById(userID);
            if (!userEmail) {
                return {
                    error: 1,
                    msg: "userID was not found"
                };
            }
            var results = yield this.addToUnsubscribe(userEmail);
            console.log(results);
            return {
                error: 0,
                msg: "user successfully was add to the unsubscribe list"
            };
        });
    };
    return Unsubscribe;
}(model_mod_1.Model));
exports.Unsubscribe = Unsubscribe;
//# sourceMappingURL=unsubscribe.mod.js.map