/// <reference path="../_all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config = require('../../config/config.json');
var nodemailer = require('nodemailer');
var fs = require('fs');
var db_1 = require('./db');
var Email = (function (_super) {
    __extends(Email, _super);
    function Email() {
        _super.call(this);
        // create reusable transporter object using the default SMTP transport
        this.sender = nodemailer.createTransport("smtps://" + config.smtp.user + ":" + config.smtp.password + "@" + config.smtp.host);
        this.id = this.createNewId("");
    }
    Email.prototype.send = function (options) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.systemEmail,
            to: options.to,
            subject: options.subject,
            html: options.html
        };
        this.saveToDB(mailOptions);
        // send mail with defined transport object
        this.sender.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    };
    // async function that load template by name
    // insert the parameters to the template
    // and then resolve the template
    Email.prototype.render = function (templateName, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(config.emailBuildDir + "/" + templateName + '.html', function (err, data) {
                if (err) {
                    throw err;
                }
                var browserLink = config.domain + "/_email/" + _this.id;
                var template = data.toString();
                // Insert the  param to the template
                for (var key in params) {
                    // For replace all string not only the first
                    // string we use regex with g
                    var re_1 = new RegExp('{{' + key + '}}', 'g');
                    template = template.replace(re_1, params[key]);
                }
                var re = new RegExp('{{_browserLink}}', 'g');
                template = template.replace(re, browserLink);
                resolve(template);
            });
        });
    };
    // async function that save every email sent from
    // the system
    Email.prototype.saveToDB = function (data) {
        var _this = this;
        var sentMail = this.makeDoc(data);
        var newID = this.createNewId("");
        data._id = this.id;
        return new Promise(function (resolve, reject) {
            _this.db.collection("_sentEmails").insert(sentMail, function (err, doc) {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve({
                    error: 0,
                    _id: doc._id
                });
                return;
            });
        });
    };
    return Email;
}(db_1.DB));
exports.Email = Email;
//# sourceMappingURL=email.js.map