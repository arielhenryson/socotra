/// <reference path="../_all.d.ts" />
"use strict";
var db_1 = require('../../core/lib/db');
module.exports = function (req, res) {
    var id = req.params.id;
    var DBObj = new db_1.DB();
    var emailObjectID = DBObj.createNewId(id);
    DBObj.db.collection("_sentEmails").findOne({ _id: emailObjectID }, function (err, doc) {
        if (doc === null) {
            res.send("This page is not available any more");
            return;
        }
        var email = doc.html;
        var re = new RegExp('{{_hideOnBrowser}}', 'g');
        email = email.replace(re, 'display:none');
        res.send(email);
    });
};
//# sourceMappingURL=emailbrowser.ctrl.js.map