/// <reference path="../_all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var db_1 = require('../lib/db');
var RequestLogger = (function (_super) {
    __extends(RequestLogger, _super);
    function RequestLogger() {
        _super.call(this);
    }
    RequestLogger.prototype.log = function (requestData) {
        var obj = this.makeDoc(requestData);
        this.db.collection("_request").insert(obj);
    };
    return RequestLogger;
}(db_1.DB));
exports.RequestLogger = RequestLogger;
//# sourceMappingURL=requestLogger.mod.js.map