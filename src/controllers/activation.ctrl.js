/// <reference path="../core/_all.d.ts" />
"use strict";
var activation_mod_1 = require('../models/activation.mod');
module.exports = function (req, res) {
    var activationKey = req.params.activationKey;
    var ActivationObj = new activation_mod_1.Activation();
    var results = ActivationObj.activateAccount(activationKey);
    results.then(function (data) {
        console.log(data);
        res.send(data);
    });
};
//# sourceMappingURL=activation.ctrl.js.map