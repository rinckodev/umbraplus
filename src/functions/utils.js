"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNpmName = exports.cancelOperation = exports.checkCancel = exports.sleep = void 0;
var promises_1 = require("node:timers/promises");
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return promises_1.setTimeout; } });
var prompts_1 = require("@clack/prompts");
function checkCancel(value) {
    if ((0, prompts_1.isCancel)(value)) {
        cancelOperation();
    }
}
exports.checkCancel = checkCancel;
function cancelOperation(message) {
    if (message === void 0) { message = "Operation cancelled."; }
    (0, prompts_1.cancel)(message);
    process.exit(0);
}
exports.cancelOperation = cancelOperation;
var validate_npm_package_name_1 = require("validate-npm-package-name");
function validateNpmName(name) {
    var _a = (0, validate_npm_package_name_1.default)(name), validForNewPackages = _a.validForNewPackages, errors = _a.errors, warnings = _a.warnings;
    if (validForNewPackages) {
        return { valid: true };
    }
    return {
        valid: false,
        problems: __spreadArray(__spreadArray([], (errors || []), true), (warnings || []), true),
    };
}
exports.validateNpmName = validateNpmName;
