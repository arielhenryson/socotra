/// <reference path="../core/_all.d.ts" />
"use strict";
var auth_mod_1 = require('../models/auth.mod');
module.exports = function (req, res) {
    var email = req.query.email;
    var password = req.query.password;
    var AuthOBJ = new auth_mod_1.Auth();
    var createUser = AuthOBJ.createUser(email, password);
    createUser.then(function (results) {
        if (results.error) {
            res.json(results);
        }
        res.json({
            msg: "user created successfully",
            error: 0
        });
    });
};
//# sourceMappingURL=signupAPI.ctrl.js.map