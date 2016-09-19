/// <reference path="../core/_all.d.ts" />
"use strict";
var unsubscribe_mod_1 = require('../models/unsubscribe.mod');
module.exports = function (req, res) {
    var userID = req.params.userID;
    var UnsubscribeObj = new unsubscribe_mod_1.Unsubscribe;
    var blockUser = UnsubscribeObj.blockUser(userID);
    blockUser.then(function (resutls) {
        console.log(resutls);
        res.send(resutls);
    });
};
//# sourceMappingURL=unsubscribe.ctrl.js.map