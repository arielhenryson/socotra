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
var email_1 = require('../core/lib/email');
var dbHelper_service_1 = require('../services/dbHelper.service');
var config = require('../config/config.json');
// the class is use to send all the email from the app
var AppEmail = (function (_super) {
    __extends(AppEmail, _super);
    function AppEmail() {
        _super.call(this);
        this.DBHelper = new dbHelper_service_1.DBHelper();
    }
    AppEmail.prototype.render = function (templateName, data) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            var templateData = {
                _appName: config.appName,
                _domain: config.domain
            };
            for (var key in data) {
                templateData[key] = data[key];
            }
            var template = yield _super.prototype.render.call(this, templateName, templateData);
            var finalTemplate = String(template);
            var userId = yield this.DBHelper.getUserIdByEmail(data.to);
            var unsubscribeLink = config.domain + '/unsubscribe/' + userId;
            finalTemplate = finalTemplate.replace('{{unsubscribeLink}}', unsubscribeLink);
            return finalTemplate;
        });
    };
    AppEmail.prototype.isInUnsubscribe = function (email) {
        var _this = this;
        var where = {
            email: email
        };
        return new Promise(function (resolve, reject) {
            _this.db.collection("unsubscribe").findOne(where, function (err, doc) {
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
    AppEmail.prototype.send = function (options) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            var isInUnsubscribe = yield this.isInUnsubscribe(options.to);
            if (isInUnsubscribe) {
                console.log("Cant send mail to " + options.to + " email is in unsubscribe list");
                return false;
            }
            _super.prototype.send.call(this, options);
        });
    };
    return AppEmail;
}(email_1.Email));
exports.AppEmail = AppEmail;
//# sourceMappingURL=appEmail.service.js.map