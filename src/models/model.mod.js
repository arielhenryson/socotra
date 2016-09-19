/// <reference path="../core/_all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var db_1 = require('../core/lib/db');
var dbHelper_service_1 = require('../services/dbHelper.service');
var config = require('../config/config.json');
var Model = (function (_super) {
    __extends(Model, _super);
    function Model() {
        _super.call(this);
        this.DBHelper = new dbHelper_service_1.DBHelper();
    }
    return Model;
}(db_1.DB));
exports.Model = Model;
//# sourceMappingURL=model.mod.js.map