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
var validator = require('../core/lib/generic/validation');
var appEmail_service_1 = require('../services/appEmail.service');
var config = require('../config/config.json');
var path = require("path");
var fs = require('fs');
var Auth = (function (_super) {
    __extends(Auth, _super);
    function Auth() {
        _super.call(this);
    }
    Auth.prototype.sendMailToNewUser = function (newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var emailObj = new appEmail_service_1.AppEmail();
            var data = {
                to: newUser.email,
                activationKey: newUser.activationKey,
            };
            var template = yield emailObj.render('signup', data);
            var emailOptions = {
                subject: config.appName + " account activation",
                to: newUser.email,
                html: template
            };
            emailObj.send(emailOptions);
        });
    };
    Auth.prototype.makeNewUser = function (email, password) {
        var _this = this;
        var solt = this.makeNewSolt();
        var hashPassword = this.hash(password, solt);
        var activationKey = this.makeNewSolt();
        var newUser = this.makeDoc({
            email: email,
            solt: solt,
            password: hashPassword,
            verified: false,
            activationKey: activationKey
        });
        this.sendMailToNewUser(newUser);
        return new Promise(function (resolve) {
            _this.db.collection("users").insert(newUser, function (err) {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
                return;
            });
        });
    };
    Auth.prototype.createUser = function (email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if the client send email and password
            // for creating the new user and if not reject the request
            if (typeof email === "undefined") {
                return {
                    error: 1,
                    msg: "Missing email value"
                };
            }
            if (typeof password === "undefined") {
                return {
                    error: 2,
                    msg: "Missing password value"
                };
            }
            email = email.toLocaleLowerCase();
            if (!validator.isValidEmail(email)) {
                return {
                    error: 3,
                    msg: "invalid email value"
                };
            }
            if (!validator.isValidPassword(password)) {
                return {
                    error: 4,
                    msg: "invalid password At least one number, one lowercase and one uppercase letter at least six characters"
                };
            }
            var isUserExists = yield this.DBHelper.isUserEmailExists(email);
            if (isUserExists) {
                return {
                    error: 1,
                    msg: 'User is alrady exsist'
                };
            }
            var makeUser = yield this.makeNewUser(email, password);
            if (!makeUser) {
                return {
                    error: 2,
                    msg: 'Cant write to DB'
                };
            }
            return {
                error: 0,
                msg: 'successfully create new user'
            };
        });
    };
    return Auth;
}(model_mod_1.Model));
exports.Auth = Auth;
//# sourceMappingURL=auth.mod.js.map